package com.project.shopapp.services;

import com.project.shopapp.models.Order;
import com.project.shopapp.models.OrderDetail;
import com.project.shopapp.models.Product;
import com.project.shopapp.reponses.admin.BestSellingProductResponse;
import com.project.shopapp.reponses.admin.InventoryStatsResponse;
import com.project.shopapp.reponses.admin.SalesStatsResponse;
import com.project.shopapp.repositories.OrderDetailRepository;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.text.NumberFormat;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminDashboardService implements IAdminDashboardService {

    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;

    @Override
    public List<InventoryStatsResponse> getInventoryStats() {
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> {
            String status;
            if (product.getQuantityInStock() == null) {
                product.setQuantityInStock(0);
            }
            if (product.getQuantityInStock() > 10) {
                status = "Còn hàng";
            } else if (product.getQuantityInStock() > 0) {
                status = "Sắp hết";
            } else {
                status = "Hết hàng";
            }
            InventoryStatsResponse response = InventoryStatsResponse.builder()
                    .id(product.getId())
                    .name(product.getName())
                    .quantityInStock(product.getQuantityInStock())
                    .status(status)
                    .categoryName(product.getCategory() != null ? product.getCategory().getName() : "Không có danh mục")
                    .build();
            response.setPrice(product.getPrice()); // Định dạng giá
            return response;
        }).collect(Collectors.toList());
    }

    @Override
    public List<BestSellingProductResponse> getBestSellingProducts(LocalDateTime startDate, LocalDateTime endDate, int limit) {
        List<OrderDetail> orderDetails = orderDetailRepository.findAll().stream()
                .filter(orderDetail -> orderDetail.getOrder().getOrderDate().isAfter(startDate) && orderDetail.getOrder().getOrderDate().isBefore(endDate))
                .collect(Collectors.toList());

        Map<Long, Integer> productQuantityMap = orderDetails.stream()
                .collect(Collectors.groupingBy(
                        orderDetail -> orderDetail.getProduct().getId(),
                        Collectors.summingInt(OrderDetail::getNumberOfProducts)
                ));

        return productQuantityMap.entrySet().stream()
                .sorted(Map.Entry.<Long, Integer>comparingByValue().reversed())
                .limit(limit)
                .map(entry -> {
                    Product product = productRepository.findById(entry.getKey()).orElse(null);
                    BestSellingProductResponse response = BestSellingProductResponse.builder()
                            .id(product.getId())
                            .name(product.getName())
                            .totalQuantitySold(entry.getValue())
                            .categoryName(product.getCategory() != null ? product.getCategory().getName() : "Không có danh mục")
                            .build();
                    response.setPrice(product.getPrice()); // Định dạng giá
                    return response;
                })
                .collect(Collectors.toList());
    }

    @Override
    public SalesStatsResponse getSalesStats(LocalDateTime startDate, LocalDateTime endDate) {
        // Lấy danh sách các đơn hàng trong khoảng thời gian
        List<Order> orders = orderRepository.findAll().stream()
                .filter(order -> order.getOrderDate() != null &&
                        order.getOrderDate().isAfter(startDate) &&
                        order.getOrderDate().isBefore(endDate))
                .collect(Collectors.toList());

        // Tính tổng doanh số
        double totalSales = orders.stream().mapToDouble(order -> order.getTotalMoney() != null ? order.getTotalMoney() : 0.0).sum();

        // Định dạng tiền Việt
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        String formattedTotalSales = formatter.format(totalSales);

        // Thống kê doanh số theo phương thức thanh toán (ví dụ)
        Map<String, Double> salesByPaymentMethod = orders.stream()
                .filter(order -> order.getPaymentMethod() != null)
                .collect(Collectors.groupingBy(
                        Order::getPaymentMethod,
                        Collectors.summingDouble(order -> order.getTotalMoney() != null ? order.getTotalMoney() : 0.0)
                ));

        // Định dạng các giá trị trong salesByPaymentMethod
        Map<String, String> formattedSalesByPaymentMethod = new HashMap<>();
        for (Map.Entry<String, Double> entry : salesByPaymentMethod.entrySet()) {
            formattedSalesByPaymentMethod.put(entry.getKey(), formatter.format(entry.getValue()));
        }

        return SalesStatsResponse.builder()
                .totalSales(formattedTotalSales)
                .salesByPaymentMethod(formattedSalesByPaymentMethod) // Sử dụng map đã định dạng
                .build();
    }
}