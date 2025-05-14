package com.skillshare.skill_platform.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.Date;


@Document(collection = "follows")
@Data
public class Follow {
    @Id
    private String id;
    private String followerId; // User who is following
    private String followedId; // User being followed
    private Date createdAt;
}