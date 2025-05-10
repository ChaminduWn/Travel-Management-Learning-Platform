package com.skillshare.skill_platform.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "chat_rooms")
@Data
public class ChatRoom {
    @Id
    private String id;
    private String name;
    private String description;
    private LocalTime time;
    private LocalDate date;
    private boolean isActive = true;
    private String createdBy;
    
    @DBRef
    private Set<User> participants = new HashSet<>();
}