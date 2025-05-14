package com.skillshare.skill_platform.entity;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "questions")
@Data
public class Question {
    @Id
    private String id;
    private String quizId;
    private String text;
    private List<String> options; // e.g., ["Option A", "Option B", "Option C", "Option D"]
    private String correctAnswer; // Index or text of correct option
}