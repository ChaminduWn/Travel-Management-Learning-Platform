package com.skillshare.skill_platform.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.skillshare.skill_platform.entity.Chat;

import java.util.List;

public interface ChatRepository extends MongoRepository<Chat, String> {
    List<Chat> findBySenderIdAndRecipientId(String senderId, String recipientId);
}