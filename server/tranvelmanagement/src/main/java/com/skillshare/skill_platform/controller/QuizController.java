package com.skillshare.skill_platform.controller;

import com.skillshare.skill_platform.dto.QuizDTO;
import com.skillshare.skill_platform.dto.QuestionDTO;
import com.skillshare.skill_platform.dto.UserAnswerDTO;
import com.skillshare.skill_platform.service.QuizService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
public class QuizController {

    @Autowired
    private QuizService quizService;

    @PostMapping
    public ResponseEntity<QuizDTO> createQuiz(@RequestBody QuizDTO quizDTO, @AuthenticationPrincipal OAuth2User principal) {
        quizDTO.setCreatedBy(principal.getAttribute("sub"));
        return new ResponseEntity<>(quizService.createQuiz(quizDTO), HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<QuizDTO> updateQuiz(@PathVariable String id, @RequestBody QuizDTO quizDTO) {
        return ResponseEntity.ok(quizService.updateQuiz(id, quizDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuiz(@PathVariable String id) {
        quizService.deleteQuiz(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<QuizDTO>> getAllQuizzes() {
        return ResponseEntity.ok(quizService.getAllQuizzes());
    }

    @GetMapping("/user")
    public ResponseEntity<List<QuizDTO>> getUserQuizzes(@AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(quizService.getUserQuizzes(principal.getAttribute("sub")));
    }

    @PostMapping("/{quizId}/questions")
    public ResponseEntity<QuestionDTO> createQuestion(@PathVariable String quizId, @RequestBody QuestionDTO questionDTO) {
        return new ResponseEntity<>(quizService.createQuestion(quizId, questionDTO), HttpStatus.CREATED);
    }

    @GetMapping("/{quizId}/questions")
    public ResponseEntity<List<QuestionDTO>> getQuizQuestions(@PathVariable String quizId) {
        return ResponseEntity.ok(quizService.getQuizQuestions(quizId));
    }

    @PostMapping("/answers")
    public ResponseEntity<UserAnswerDTO> submitAnswer(@RequestBody UserAnswerDTO userAnswerDTO, @AuthenticationPrincipal OAuth2User principal) {
        userAnswerDTO.setUserId(principal.getAttribute("sub"));
        return ResponseEntity.ok(quizService.submitAnswer(userAnswerDTO));
    }

    @GetMapping("/{quizId}/score")
    public ResponseEntity<Integer> getScore(@PathVariable String quizId, @AuthenticationPrincipal OAuth2User principal) {
        return ResponseEntity.ok(quizService.calculateScore(quizId, principal.getAttribute("sub")));
    }
}