package com.project.shopapp.controllers;


import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.components.SecurityUtils;
import com.project.shopapp.dtos.OrderDTO;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Order;
import com.project.shopapp.models.OrderStatus;
import com.project.shopapp.models.User;
import com.project.shopapp.reponses.order.OrderResponse;
import com.project.shopapp.reponses.ResponseObject;
import com.project.shopapp.services.IOrderService;
import com.project.shopapp.services.invoice.IInvoiceService;
import com.project.shopapp.services.notification.INotificationService;
import com.project.shopapp.utils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/orders")
@Slf4j
@RequiredArgsConstructor
public class OrderController {
    private final IOrderService orderService;
    private final INotificationService notificationService;

    private final LocalizationUtils localizationUtils;
    private final SecurityUtils securityUtils;
    private final IInvoiceService invoiceService;

    @GetMapping("/user/{user_id}")// http://localhost:8088/api/v1/orders/user/1
    public ResponseEntity<?> getOrders(
            @Valid @PathVariable("user_id") Long userId
    ){
        try {
            log.info("Fetching orders for user ID: {}", userId);
            List<Order> orders = orderService.findByUserId(userId);
            return ResponseEntity.ok(orders );
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@Valid @PathVariable("id") Long orderId) {
        try {

            log.info("Fetching order with ID: {}", orderId);
            Order existingOrder = orderService.getOrderById(orderId);
            OrderResponse orderResponse = OrderResponse.fromOrder(existingOrder);
            return ResponseEntity.ok(orderResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<ResponseObject> createOrder(
            @Valid @RequestBody OrderDTO orderDTO,
            BindingResult result
    ) throws Exception {
        log.info("Creating new order for user ID: {}", orderDTO);
        if(result.hasErrors()) {
            List<String> errorMessages = result.getFieldErrors()
                    .stream()
                    .map(FieldError::getDefaultMessage)
                    .toList();
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(String.join(";", errorMessages))
                            .status(HttpStatus.BAD_REQUEST)
                            .build());
        }
        User loginUser = securityUtils.getLoggedInUser();
        if(orderDTO.getUserId() == null) {
            orderDTO.setUserId(loginUser.getId());
        }
        Order orderResponse = orderService.createOrder(orderDTO);
        User orderUser = orderResponse.getUser();
        String message = String.format("Đơn hàng #%d của bạn đã được đặt thành công!", orderResponse.getId());
        String link = "/orders/" + orderResponse.getId();
        notificationService.createNotification(orderUser, message, "🛍️", link);
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Insert order successfully")
                .data(orderResponse)
                .status(HttpStatus.OK)
                .build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    //PUT http://localhost:8088/api/v1/orders/2
    public ResponseEntity<ResponseObject> updateOrder(
            @Valid @PathVariable long id,
            @Valid @RequestBody OrderDTO orderDTO) throws Exception {
            log.info("Updating order with ID: {}", id);
        Order order = orderService.updateOrder(id, orderDTO);
        return ResponseEntity.ok(new ResponseObject("Update order successfully", HttpStatus.OK, order));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(
            @Valid @PathVariable long id){
        //Xóa mềm => active = false
        orderService.deleteOrder(id);
        return ResponseEntity.ok(localizationUtils
                .getLocalizedMessage(MessageKeys.DELETE_ORDER_SUCCESSFULLY,id));
    }

    @GetMapping("/get-orders-by-keyword")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseObject> getOrdersByKeyword(
            @RequestParam(defaultValue = "", required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        // Tạo Pageable từ thông tin trang và giới hạn
        PageRequest pageRequest = PageRequest.of(
                page, limit,
                //Sort.by("createdAt").descending()
                Sort.by("id").ascending()
        );
        Page<OrderResponse> orderPage = orderService
                .getOrdersByKeyword(keyword, pageRequest)
                .map(OrderResponse::fromOrder);
        // Lấy tổng số trang
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("orders", orderPage.getContent());
        responseData.put("totalPages", orderPage.getTotalPages());
        responseData.put("totalItems", orderPage.getTotalElements());
        responseData.put("currentPage", orderPage.getNumber());

        return ResponseEntity.ok().body(ResponseObject.builder()
                .message("Get orders successfully")
                .status(HttpStatus.OK)
                .data(responseData)
                .build());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('ROLE_USER')")
    public ResponseEntity<ResponseObject> updateOrderStatus(
            @Valid @PathVariable Long id,
            @RequestParam String status) throws Exception {
        // Gọi service để cập nhật trạng thái
        Order updatedOrder = orderService.updateOrderStatus(id, status);
        // Trả về phản hồi thành công
        return ResponseEntity.ok(ResponseObject.builder()
                .message("Order status updated successfully")
                .status(HttpStatus.OK)
                .data(OrderResponse.fromOrder(updatedOrder))
                .build());
    }

    @GetMapping("/user/{userId}/history")
    @PreAuthorize("hasRole('ROLE_ADMIN') or #userId == @securityUtils.getLoggedInUserId()")
    public ResponseEntity<ResponseObject> getOrderHistory(
            @Valid @PathVariable("userId") Long userId
    ) {
        try {
            List<Order> orders = orderService.findByUserId(userId);
            List<OrderResponse> orderResponses = orders.stream()
                    .map(OrderResponse::fromOrder)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .message("Get order history successfully")
                            .data(orderResponses)
                            .status(HttpStatus.OK)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .build()
            );
        }
    }

    @PutMapping("/{orderId}/cancel")
    @PreAuthorize("hasRole('ROLE_ADMIN') or @securityUtils.isOrderOwner(#orderId)")
    public ResponseEntity<ResponseObject> cancelOrder(
            @Valid @PathVariable("orderId") Long orderId
    ) {
        try {
            Order order = orderService.getOrderById(orderId);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }

            if (!order.getStatus().equals(OrderStatus.PENDING)) {
                return ResponseEntity.badRequest().body(
                        ResponseObject.builder()
                                .message("Cannot cancel order with status: " + order.getStatus())
                                .status(HttpStatus.BAD_REQUEST)
                                .build()
                );
            }

            Order cancelledOrder = orderService.updateOrderStatus(orderId, OrderStatus.CANCELLED);
            return ResponseEntity.ok(
                    ResponseObject.builder()
                            .message("Order cancelled successfully")
                            .data(OrderResponse.fromOrder(cancelledOrder))
                            .status(HttpStatus.OK)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(
                    ResponseObject.builder()
                            .message(e.getMessage())
                            .status(HttpStatus.BAD_REQUEST)
                            .build()
            );
        }
    }
    @GetMapping("/{orderId}/invoice")
    // @PreAuthorize("hasRole('ROLE_ADMIN') or @securityUtils.isOrderOwner(#orderId)")
    public ResponseEntity<?> exportInvoice(@PathVariable Long orderId) {
        try {
            byte[] pdfBytes = invoiceService.generateInvoicePdf(orderId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            String filename = "hoa-don-" + orderId + ".pdf";
            headers.setContentDispositionFormData("attachment", filename);


            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);

        } catch (DataNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    ResponseObject.builder()
                            .message("Không thể xuất hóa đơn: " + e.getMessage())
                            .status(HttpStatus.NOT_FOUND)
                            .data(null)
                            .build());
        } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .message("Lỗi khi tạo hóa đơn: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .data(null)
                            .build());
        }
    }
}
