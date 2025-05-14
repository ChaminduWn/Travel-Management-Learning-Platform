package com.skillshare.skill_platform.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuizDTO {
    private String id;
    private String title;
    private String description;
    private String category;
    private String createdBy;
    private List<String> questionIds;
    private boolean isActive;
}