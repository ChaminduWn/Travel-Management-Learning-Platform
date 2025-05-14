package com.skillshare.skill_platform.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "user_answers")
@Data
public class UserAnswer {
    @Id
    private String id;
    private String quizId;
    private String questionId;
    private String userId;
    private String selectedAnswer;
    private boolean isCorrect;
}