// File: controllers/NotificationController.java
package com.project.shopapp.controllers;

import com.project.shopapp.components.SecurityUtils;
import com.project.shopapp.reponses.NotificationResponse;
import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Notification;
import com.project.shopapp.models.User;
import com.project.shopapp.reponses.ResponseObject;
import com.project.shopapp.services.notification.INotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("${api.prefix}/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final INotificationService notificationService;
    private final SecurityUtils securityUtils;

    @GetMapping("")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getNotificationsForCurrentUser() {
        try {
            User currentUser = securityUtils.getLoggedInUser();
            List<Notification> notifications = notificationService.getNotificationsByUserId(currentUser.getId());
            List<NotificationResponse> notificationResponses = notifications.stream()
                    .map(NotificationResponse::fromNotification)
                    .collect(Collectors.toList());
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Notifications fetched successfully")
                    .status(HttpStatus.OK)
                    .data(notificationResponses)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                ResponseObject.builder()
                    .message("Failed to fetch notifications: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build());
        }
    }

    @GetMapping("/unread-count")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getUnreadNotificationCount() {
        try {
            User currentUser = securityUtils.getLoggedInUser();
            long count = notificationService.getUnreadNotificationCount(currentUser.getId());
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Unread notification count fetched successfully")
                    .status(HttpStatus.OK)
                    .data(count)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                 ResponseObject.builder()
                    .message("Failed to fetch unread count: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build());
        }
    }

    @PutMapping("/{notificationId}/read")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markNotificationAsRead(@PathVariable Long notificationId) {
        try {
            User currentUser = securityUtils.getLoggedInUser();
            Notification updatedNotification = notificationService.markAsRead(notificationId, currentUser.getId());
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("Notification marked as read")
                    .status(HttpStatus.OK)
                    .data(NotificationResponse.fromNotification(updatedNotification))
                    .build());
        } catch (DataNotFoundException e) {
             return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                 ResponseObject.builder()
                    .message(e.getMessage())
                    .status(HttpStatus.NOT_FOUND)
                    .build());
        } catch (Exception e) {
             return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                 ResponseObject.builder()
                    .message("Failed to mark notification as read: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build());
        }
    }

    @PutMapping("/read-all")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> markAllNotificationsAsRead() {
        try {
            User currentUser = securityUtils.getLoggedInUser();
            notificationService.markAllAsRead(currentUser.getId());
            return ResponseEntity.ok(ResponseObject.builder()
                    .message("All notifications marked as read")
                    .status(HttpStatus.OK)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                 ResponseObject.builder()
                    .message("Failed to mark all notifications as read: " + e.getMessage())
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .build());
        }
    }
}