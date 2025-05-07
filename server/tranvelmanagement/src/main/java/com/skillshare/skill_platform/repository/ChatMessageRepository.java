package com.skillshare.skill_platform.repository;


import com.skillshare.skill_platform.entity.ChatMessage;
import com.skillshare.skill_platform.entity.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {
    List<ChatMessage> findByChatRoomIdOrderByTimestampAsc(String chatRoomId);
}