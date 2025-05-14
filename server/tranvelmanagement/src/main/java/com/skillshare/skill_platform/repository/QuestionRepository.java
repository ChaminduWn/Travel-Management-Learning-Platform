package com.skillshare.skill_platform.repository;

import com.skillshare.skill_platform.entity.Question;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findByQuizId(String quizId);

    @Query(value = "{'quizId' : ?0}")
    void deleteByQuizId(String quizId);
}