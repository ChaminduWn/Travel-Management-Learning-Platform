package com.skillshare.skill_platform.service;

import com.skillshare.skill_platform.dto.QuizDTO;
import com.skillshare.skill_platform.dto.QuestionDTO;
import com.skillshare.skill_platform.dto.UserAnswerDTO;

import java.util.List;

public interface QuizService {
    QuizDTO createQuiz(QuizDTO quizDTO);
    QuizDTO updateQuiz(String id, QuizDTO quizDTO);
    void deleteQuiz(String id);
    List<QuizDTO> getAllQuizzes();
    List<QuizDTO> getUserQuizzes(String userId);
    QuestionDTO createQuestion(String quizId, QuestionDTO questionDTO);
    List<QuestionDTO> getQuizQuestions(String quizId);
    UserAnswerDTO submitAnswer(UserAnswerDTO userAnswerDTO);
    int calculateScore(String quizId, String userId);
}