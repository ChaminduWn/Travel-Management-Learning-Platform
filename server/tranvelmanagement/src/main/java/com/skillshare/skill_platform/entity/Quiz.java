package com.skillshare.skill_platform.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "quizzes")
@Data
public class Quiz {
    @Id
    private String id;
    private String title;
    private String description;
    private String category; // e.g., "Travel", "Adventure", "Skill"
    private String createdBy; // User ID
    private List<String> questionIds;
    private boolean isActive;
}