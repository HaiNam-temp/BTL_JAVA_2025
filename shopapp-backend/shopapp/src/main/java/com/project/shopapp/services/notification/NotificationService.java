package com.project.shopapp.services.notification;

import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Notification;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService implements INotificationService {
    private final NotificationRepository notificationRepository;

    @Override
    public Notification createNotification(User user, String message, String icon, String link) {
        Notification notification = Notification.builder()
                .user(user)
                .message(message)
                .icon(icon)
                .link(link)
                .isRead(false)
                .build();
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public long getUnreadNotificationCount(Long userId) {
        return notificationRepository.findByUserIdAndIsReadFalse(userId).size();
    }

    @Override
    @Transactional
    public Notification markAsRead(Long notificationId, Long userId) throws DataNotFoundException {
        int updatedCount = notificationRepository.markAsRead(notificationId, userId);
        if (updatedCount == 0) {
            throw new DataNotFoundException("Notification not found or already marked as read, or user mismatch.");
        }
        return notificationRepository.findById(notificationId)
                .orElseThrow(() -> new DataNotFoundException("Notification not found after marking as read."));
    }

    @Override
    @Transactional
    public void markAllAsRead(Long userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    @Override
    @Transactional
    public void deleteNotification(Long notificationId, Long userId) throws DataNotFoundException {
         Notification notification = notificationRepository.findById(notificationId)
            .orElseThrow(() -> new DataNotFoundException("Notification not found with id: " + notificationId));
        if (!notification.getUser().getId().equals(userId)) {
            throw new DataNotFoundException("User does not have permission to delete this notification");
        }
        notificationRepository.deleteById(notificationId);
    }
}