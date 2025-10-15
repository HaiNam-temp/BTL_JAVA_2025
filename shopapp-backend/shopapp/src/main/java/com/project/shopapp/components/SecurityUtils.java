package com.project.shopapp.components;
import com.project.shopapp.models.Order;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.OrderRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public SecurityUtils(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public User getLoggedInUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null &&
                authentication.getPrincipal() instanceof User selectedUser) {
            if(!selectedUser.isActive()) {
                return null;
            }
            return (User) authentication.getPrincipal();
        }
        return null;
    }

    public Long getLoggedInUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null &&
                authentication.getPrincipal() instanceof User selectedUser) {
            if(!selectedUser.isActive()) {
                return null; // Hoặc throw exception nếu cần
            }
            return selectedUser.getId();
        }
        return null; // Hoặc throw exception nếu không tìm thấy
    }

    private final OrderRepository orderRepository; // Inject OrderRepository (như bạn đã làm với UserRepository)

    public boolean isOrderOwner(Long orderId) {
        Order order = orderRepository.findById(orderId).orElse(null);
        if (order == null) {
            return false; // Hoặc throw DataNotFoundException nếu cần
        }
        Long loggedInUserId = getLoggedInUserId();
        if (loggedInUserId == null) {
            return false; // Hoặc throw AuthenticationException nếu không có user đăng nhập
        }
        return order.getUser().getId().equals(loggedInUserId);
    }

}
