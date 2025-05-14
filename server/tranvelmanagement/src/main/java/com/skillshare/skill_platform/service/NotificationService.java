package com.skillshare.skill_platform.service;

import com.skillshare.skill_platform.entity.Notification;

import java.util.List;

public interface NotificationService {
    
    Notification createNotification(String userId, String type, String message, String relatedId);
    
    List<Notification> getUserNotifications(String userId);
    
    void markAsRead(String notificationId);
    
    void markAllAsRead(String userId);
}