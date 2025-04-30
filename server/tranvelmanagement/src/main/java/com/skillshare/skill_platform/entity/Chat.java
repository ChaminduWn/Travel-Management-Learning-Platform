package com.skillshare.skill_platform.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "chats")
@Data
public class Chat {
    @Id
    private String id;
    private String senderId;
    private String recipientId;
    private String content;
    private String timestamp;
}