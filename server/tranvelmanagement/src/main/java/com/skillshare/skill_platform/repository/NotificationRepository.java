package com.skillshare.skill_platform.repository;

import com.skillshare.skill_platform.entity.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    List<Notification> findByUserIdOrderByCreatedAtDesc(String userId);
    
    List<Notification> findByUserIdAndReadFalse(String userId);
}