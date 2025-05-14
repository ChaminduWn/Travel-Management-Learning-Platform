package com.skillshare.skill_platform.service.Impl;

import com.skillshare.skill_platform.entity.Notification;
import com.skillshare.skill_platform.repository.NotificationRepository;
import com.skillshare.skill_platform.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class NotificationServiceImpl implements NotificationService {
    
    @Autowired
    private NotificationRepository notificationRepository;
    
    @Override
    public Notification createNotification(String userId, String type, String message, String relatedId) {
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setUserId(userId);
        notification.setType(type);
        notification.setMessage(message);
        notification.setRelatedId(relatedId);
        notification.setRead(false);
        notification.setCreatedAt(new Date());
        return notificationRepository.save(notification);
    }
    
    @Override
    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }
    
    @Override
    public void markAsRead(String notificationId) {
        notificationRepository.findById(notificationId).ifPresent(notification -> {
            notification.setRead(true);
            notificationRepository.save(notification);
        });
    }
    
    @Override
    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalse(userId);
        for (Notification notification : notifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(notifications);
    }
}