package com.skillshare.skill_platform.dto;

import lombok.Data;

import java.util.List;

@Data
public class QuestionDTO {
    private String id;
    private String quizId;
    private String text;
    private List<String> options;
    private String correctAnswer; // Only sent to admins/creators
}