package com.skillshare.skill_platform.controller;

import com.skillshare.skill_platform.dto.UserAnswerDTO;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class QuizWebSocketController {

    @MessageMapping("/quiz.answer")
    @SendTo("/topic/quiz")
    public UserAnswerDTO handleAnswer(UserAnswerDTO userAnswerDTO) {
        return userAnswerDTO; // Broadcast answer to all participants
    }
}