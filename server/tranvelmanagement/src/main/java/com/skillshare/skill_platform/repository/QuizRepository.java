package com.skillshare.skill_platform.repository;

import com.skillshare.skill_platform.entity.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuizRepository extends MongoRepository<Quiz, String> {
    List<Quiz> findByCreatedBy(String createdBy);
    List<Quiz> findByIsActiveTrue();
}