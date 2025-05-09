package com.skillshare.skill_platform.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "chat_messages")
@Data
public class ChatMessage {
    @Id
    private String id;
    private String content;
    
    @DBRef
    private User sender;
    
    @DBRef
    private ChatRoom chatRoom;
    private LocalDateTime timestamp;
    
    // Getters and setters
}