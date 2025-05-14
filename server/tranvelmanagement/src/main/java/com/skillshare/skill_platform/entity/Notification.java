package com.skillshare.skill_platform.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.Date;

@Document(collection = "notifications")
@Data
public class Notification {
    @Id
    private String id;
    private String userId; // Recipient of the notification
    private String type; // e.g., "LIKE", "COMMENT", "FOLLOW"
    private String message;
    private String relatedId; // e.g., postId, commentId, or followed userId
    private boolean read;
    private Date createdAt;
}