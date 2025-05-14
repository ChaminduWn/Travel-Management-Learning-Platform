package com.skillshare.skill_platform.dto;

import lombok.Data;

@Data
public class UserAnswerDTO {
    private String quizId;
    private String questionId;
    private String userId;
    private String selectedAnswer;
}