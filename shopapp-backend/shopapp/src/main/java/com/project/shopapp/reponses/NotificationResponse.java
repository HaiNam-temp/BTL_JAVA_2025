// File: reponses/NotificationResponse.java
package com.project.shopapp.reponses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.shopapp.models.Notification;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class NotificationResponse {
    @JsonProperty("id")
    private Long id;

    @JsonProperty("message")
    private String message;

    @JsonProperty("icon")
    private String icon;

    @JsonProperty("link")
    private String link;

    @JsonProperty("is_read")
    private boolean isRead;

    @JsonProperty("created_at")
    private LocalDateTime createdAt;

    public static NotificationResponse fromNotification(Notification notification) {
        return NotificationResponse.builder()
                .id(notification.getId())
                .message(notification.getMessage())
                .icon(notification.getIcon())
                .link(notification.getLink())
                .isRead(notification.isRead())
                .createdAt(notification.getCreatedAt())
                .build();
    }
}