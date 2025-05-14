package com.skillshare.skill_platform.repository;

import com.skillshare.skill_platform.entity.UserAnswer;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface UserAnswerRepository extends MongoRepository<UserAnswer, String> {
    List<UserAnswer> findByQuizIdAndUserId(String quizId, String userId);

    @Query(value = "{'quizId' : ?0}")
    void deleteByQuizId(String quizId);
}