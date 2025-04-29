package com.tranvelmanagement.tranvelmanagement.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Document(collection = "chats")
public class Chat {
    @Id
    private String id;
    private String chatName;
    private boolean isGroupChat;
    
    @DBRef
    private List<User> users = new ArrayList<>();
    
    @DBRef
    private Message latestMessage;
    
    @DBRef
    private User groupAdmin;
    
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}