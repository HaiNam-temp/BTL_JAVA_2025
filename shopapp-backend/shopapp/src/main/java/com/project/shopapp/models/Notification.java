// File: models/Notification.java
package com.project.shopapp.models;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp; // Hoặc dùng @PrePersist

import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY) // Thông báo này dành cho User nào
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "message", nullable = false, length = 1000)
    private String message; // Nội dung thông báo

    @Column(name = "icon", length = 50) // Lưu icon dưới dạng emoji hoặc class CSS
    private String icon;

    @Column(name = "link", length = 255) // Đường dẫn khi click vào thông báo (ví dụ: chi tiết đơn hàng)
    private String link;

    @Column(name = "is_read", nullable = false)
    private boolean isRead = false; // Mặc định là chưa đọc

    @CreationTimestamp // Tự động gán thời gian tạo
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Bạn có thể thêm các trường khác nếu cần, ví dụ: notification_type
}