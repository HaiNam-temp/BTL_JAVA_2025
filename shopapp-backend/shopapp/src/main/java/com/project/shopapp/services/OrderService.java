package com.project.shopapp.services;

import com.project.shopapp.dtos.CartItemDTO;
import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.*;
import com.project.shopapp.repositories.*;
import com.project.shopapp.services.notification.INotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RequiredArgsConstructor
@Slf4j
@Service
public class OrderService implements IOrderService{
    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final CouponRepository couponRepository;
    private final INotificationService notificationService;
    private final ModelMapper modelMapper;
    @Override
    @Transactional
    public Order createOrder(OrderDTO orderDTO){
        try {
            log.info("Start creating order for user id: {}", orderDTO);
            //tìm xem user'id có tồn tại ko
            User user = userRepository
                    .findById(orderDTO.getUserId())
                    .orElseThrow(() -> new DataNotFoundException("Cannot find user with id: " + orderDTO.getUserId()));
            //convert orderDTO => Order
            //dùng thư viện Model Mapper
            // Tạo một luồng bảng ánh xạ riêng để kiểm soát việc ánh xạ
            modelMapper.typeMap(OrderDTO.class, Order.class)
                    .addMappings(mapper -> mapper.skip(Order::setId));
            // Cập nhật các trường của đơn hàng từ orderDTO
            Order order = new Order();
            modelMapper.map(orderDTO, order);
            order.setUser(user);
            order.setOrderDate(LocalDateTime.now());//lấy thời điểm hiện tại
            order.setStatus(OrderStatus.PENDING);
            //Kiểm tra shipping date phải >= ngày hôm nay
            LocalDate shippingDate = orderDTO.getShippingDate() == null
                    ? LocalDate.now() : orderDTO.getShippingDate();
            if (shippingDate.isBefore(LocalDate.now())) {
                throw new DataNotFoundException("Date must be at least today !");
            }
            order.setShippingDate(shippingDate);
            order.setActive(true);//đoạn này nên set sẵn trong sql
            //EAV-Entity-Attribute-Value model
            order.setTotalMoney(orderDTO.getTotalMoney());
            // Lưu vnpTxnRef nếu có
            if (orderDTO.getVnpTxnRef() != null) {
                order.setVnpTxnRef(orderDTO.getVnpTxnRef());
            }
            if (orderDTO.getShippingAddress() == null) {
                order.setShippingAddress(orderDTO.getAddress());
            }
            // Tạo danh sách các đối tượng OrderDetail từ cartItems
            List<OrderDetail> orderDetails = new ArrayList<>();
            for (CartItemDTO cartItemDTO : orderDTO.getCartItems()) {
                // Tạo một đối tượng OrderDetail từ CartItemDTO
                OrderDetail orderDetail = new OrderDetail();
                orderDetail.setOrder(order);

                // Lấy thông tin sản phẩm từ cartItemDTO
                Long productId = cartItemDTO.getProductId();
                int quantityOrdered = cartItemDTO.getQuantity();

                // Tìm thông tin sản phẩm từ cơ sở dữ liệu (hoặc sử dụng cache nếu cần)
                Product product = productRepository.findById(productId)
                        .orElseThrow(() -> new DataNotFoundException("Product not found with id: " + productId));

                if (product.getQuantityInStock() == null) { //
                    throw new Exception("Product " + product.getName() + " does not have stock information."); //
                }
                if (product.getQuantityInStock() < quantityOrdered) { //
                    throw new Exception("Not enough stock for product: " + product.getName() + //
                            ". Requested: " + quantityOrdered + ", Available: " + product.getQuantityInStock()); //
                }
                // Giảm số lượng tồn kho
                product.setQuantityInStock(product.getQuantityInStock() - quantityOrdered); //
                productRepository.save(product); // Lưu lại thông tin sản phẩm với số lượng tồn kho mới


                // Đặt thông tin cho OrderDetail
                orderDetail.setProduct(product);
                orderDetail.setNumberOfProducts(quantityOrdered);
                // Các trường khác của OrderDetail nếu cần
                orderDetail.setPrice(product.getPrice());
                orderDetail.setTotalMoney(product.getPrice() * quantityOrdered);
                // Thêm OrderDetail vào danh sách
                orderDetails.add(orderDetail);
            }

            //coupon
            String couponCode = orderDTO.getCouponCode();
            if (!couponCode.isEmpty()) {
                Coupon coupon = couponRepository.findByCode(couponCode)
                        .orElseThrow(() -> new IllegalArgumentException("Coupon not found"));

                if (!coupon.isActive()) {
                    throw new IllegalArgumentException("Coupon is not active");
                }

                order.setCoupon(coupon);
            } else {
                order.setCoupon(null);
            }
            // Lưu danh sách OrderDetail vào cơ sở dữ liệu
            log.info("Saving order details: {}", orderDetails.size());
            log.info("Associated order: {}", order.getTotalMoney());
            orderRepository.save(order);
            orderDetailRepository.saveAll(orderDetails);
            return order;
        }catch (Exception e){
            log.error("Error creating order: {}", e.getMessage());
            throw new RuntimeException(e.getMessage());
        }
    }

    @Override
    public Order getOrderById(Long orderId) {
        // Tìm theo ID
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            // Nếu không tìm thấy theo ID, tìm theo vnpTxnRef
            order = orderRepository.findByVnpTxnRef(orderId.toString()).orElse(null);
        }
        return order;
    }
    @Override
    @Transactional
    public Order updateOrder(Long id, OrderDTO orderDTO) throws DataNotFoundException {
        Order order = orderRepository.findById(id).orElseThrow(
                ()->new DataNotFoundException("Cannot find order with id: "+id));
        User existingUser = userRepository.findById(orderDTO.getUserId()).orElseThrow(
                ()->new DataNotFoundException("Cannot find user with id: "+id));
        modelMapper.typeMap(OrderDTO.class,Order.class)
                .addMappings(mapper->mapper.skip(Order::setId));
        modelMapper.map(orderDTO,order);
        order.setUser(existingUser);

        return orderRepository.save(order);
    }

    @Override
    @Transactional
    public void deleteOrder(Long id) {
        Order order = orderRepository.findById(id).orElse(null);
        //no hard_delete --> soft_delete
        if(order!=null){
            order.setActive(false);
            orderRepository.save(order);
        }
    }

    @Override
    public List<Order> findByUserId(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    @Override
    public Page<Order> getOrdersByKeyword(String keyword, Pageable pageable) {
        return  orderRepository.findByKeyword(keyword,pageable);
    }

    @Override
    @Transactional
    public Order updateOrderStatus(Long id, String status) throws DataNotFoundException, IllegalArgumentException {
        // Tìm đơn hàng theo ID
        Order order = getOrderById(id); // Sẽ tìm theo ID trước, sau đó tìm theo vnpTxnRef

        // Kiểm tra trạng thái hợp lệ
        if (status == null || status.trim().isEmpty()) {
            throw new IllegalArgumentException("Status cannot be null or empty");
        }

        // Kiểm tra xem trạng thái có nằm trong danh sách hợp lệ không
        if (!OrderStatus.VALID_STATUSES.contains(status)) {
            throw new IllegalArgumentException("Invalid status: " + status);
        }

        // Kiểm tra logic chuyển đổi trạng thái
        String currentStatus = order.getStatus();
        if (currentStatus.equals(OrderStatus.DELIVERED) && !status.equals(OrderStatus.CANCELLED)) {
            throw new IllegalArgumentException("Cannot change status from DELIVERED to " + status);
        }

        if (currentStatus.equals(OrderStatus.CANCELLED)) {
            throw new IllegalArgumentException("Cannot change status of a CANCELLED order");
        }

        if (status.equals(OrderStatus.CANCELLED)) {
            // Kiểm tra xem đơn hàng có thể bị hủy không
            if (!currentStatus.equals(OrderStatus.PENDING)) {
                throw new IllegalArgumentException("Order can only be cancelled from PENDING status");
            }
        }

        // Cập nhật trạng thái đơn hàng
        order.setStatus(status);
        Order updatedOrder = orderRepository.save(order);

        // --- THÊM LOGIC TẠO THÔNG BÁO ---
        User orderUser = updatedOrder.getUser();
        if (orderUser != null) { // Đảm bảo user tồn tại
            String notificationMessage = "";
            String icon = "🔄"; // Icon mặc định cho cập nhật
            String link = "/user/orders/" + updatedOrder.getId(); // Link frontend tới chi tiết đơn hàng

            switch (status) {
                case OrderStatus.PROCESSING:
                    notificationMessage = String.format("Đơn hàng #%d của bạn đang được xử lý.", updatedOrder.getId());
                    icon = "⏳";
                    break;
                case OrderStatus.SHIPPED:
                    notificationMessage = String.format("Đơn hàng #%d đã được giao cho đơn vị vận chuyển.", updatedOrder.getId());
                    icon = "🚚";
                    break;
                case OrderStatus.DELIVERED:
                    notificationMessage = String.format("Đơn hàng #%d đã được giao thành công!", updatedOrder.getId());
                    icon = "✅";
                    break;
                case OrderStatus.CANCELLED:
                    notificationMessage = String.format("Đơn hàng #%d đã bị hủy.", updatedOrder.getId());
                    icon = "❌";
                    break;
                // Bạn có thể thêm case cho các trạng thái khác nếu có
            }

            if (!notificationMessage.isEmpty()) {
                notificationService.createNotification(orderUser, notificationMessage, icon, link);
            }
        }
        // Lưu đơn hàng đã cập nhật
        return updatedOrder;
    }


}
