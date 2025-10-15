package com.project.shopapp.services.notification;

import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Notification;
import com.project.shopapp.models.User;

import java.util.List;

public interface INotificationService {
    Notification createNotification(User user, String message, String icon, String link);
    List<Notification> getNotificationsByUserId(Long userId);
    long getUnreadNotificationCount(Long userId);
    Notification markAsRead(Long notificationId, Long userId) throws DataNotFoundException;
    void markAllAsRead(Long userId);
    void deleteNotification(Long notificationId, Long userId) throws DataNotFoundException;
}