package com.project.shopapp.services;

import com.project.shopapp.dtos.OrderDetailDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.models.OrderDetail;
import com.project.shopapp.models.Product;
import com.project.shopapp.repositories.OrderDetailRepository;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
@Service
@RequiredArgsConstructor
public class OrderDetailService implements IOrderDetailService{
    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ProductRepository productRepository;

    @Override
    public OrderDetail createOrderDetail(OrderDetailDTO orderDetailDTO) throws Exception {
        Order order = orderRepository.findById(orderDetailDTO.getOrderId()).orElseThrow(
                ()->new DataNotFoundException("Cannot find order with order id = " + orderDetailDTO.getOrderId())
        );
        Product product = productRepository.findById(orderDetailDTO.getProductId()).orElseThrow(
                ()-> new DataNotFoundException("Cannot find product with id = " + orderDetailDTO.getProductId())
        );
        OrderDetail orderDetail = OrderDetail.builder()
                .order(order)
                .product(product)
                .price(orderDetailDTO.getPrice())
                .numberOfProducts(orderDetailDTO.getNumberOfProducts())
                .totalMoney(orderDetailDTO.getTotalMoney())
                .color(orderDetailDTO.getColor())
                .build();
        return orderDetailRepository.save(orderDetail);
    }

    @Override
    public OrderDetail gerOrderDetail(Long id) throws Exception {
        return orderDetailRepository.findById(id).orElseThrow(
                () -> new DataNotFoundException("Cannot find Order detail with id: " + id)
        );
    }

    @Override
    public OrderDetail updateOrderDetail(Long id, OrderDetailDTO orderDetailDTO) throws Exception {
        OrderDetail existingOrderDetail = orderDetailRepository.findById(id).orElseThrow(
                () -> new DataNotFoundException("Cannot find Order detail with id: " + id)
        );
        Order exsitingOrder = orderRepository.findById(orderDetailDTO.getOrderId()).orElseThrow(
                () -> new DataNotFoundException("Cannot find Order with id: " + orderDetailDTO.getOrderId())
        );
        Product exsitingProduct = productRepository.findById(orderDetailDTO.getProductId()).orElseThrow(
                ()-> new DataNotFoundException("Cannot find product with id = " + orderDetailDTO.getProductId())
        );
        existingOrderDetail.setPrice(orderDetailDTO.getPrice());
        existingOrderDetail.setNumberOfProducts(orderDetailDTO.getNumberOfProducts());
        existingOrderDetail.setTotalMoney(orderDetailDTO.getTotalMoney());
        existingOrderDetail.setColor(orderDetailDTO.getColor());
        existingOrderDetail.setOrder(exsitingOrder);
        existingOrderDetail.setProduct(exsitingProduct);
        return orderDetailRepository.save(existingOrderDetail);
    }

    @Override
    @Transactional
    public void deleteById(Long id) {
        orderDetailRepository.deleteById(id);
    }

    @Override
    public List<OrderDetail> findByOrderId(Long orderId) {
        return orderDetailRepository.findByOrderId(orderId);
    }
}
