package com.skillshare.skill_platform.service.Impl;

import com.skillshare.skill_platform.dto.QuizDTO;
import com.skillshare.skill_platform.dto.QuestionDTO;
import com.skillshare.skill_platform.dto.UserAnswerDTO;
import com.skillshare.skill_platform.entity.Quiz;
import com.skillshare.skill_platform.entity.Question;
import com.skillshare.skill_platform.entity.UserAnswer;
import com.skillshare.skill_platform.repository.QuizRepository;
import com.skillshare.skill_platform.repository.QuestionRepository;
import com.skillshare.skill_platform.repository.UserAnswerRepository;
import com.skillshare.skill_platform.service.QuizService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class QuizServiceImpl implements QuizService {

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private UserAnswerRepository userAnswerRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public QuizDTO createQuiz(QuizDTO quizDTO) {
        Quiz quiz = modelMapper.map(quizDTO, Quiz.class);
        quiz = quizRepository.save(quiz);
        return modelMapper.map(quiz, QuizDTO.class);
    }

    @Override
    public QuizDTO updateQuiz(String id, QuizDTO quizDTO) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        modelMapper.map(quizDTO, quiz);
        quiz = quizRepository.save(quiz);
        return modelMapper.map(quiz, QuizDTO.class);
    }

    @Override
    public void deleteQuiz(String id) {
        quizRepository.deleteById(id);
        questionRepository.deleteByQuizId(id);
        userAnswerRepository.deleteByQuizId(id);
    }

    @Override
    public List<QuizDTO> getAllQuizzes() {
        List<Quiz> quizzes = quizRepository.findByIsActiveTrue();
        return quizzes.stream()
                .map(quiz -> modelMapper.map(quiz, QuizDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<QuizDTO> getUserQuizzes(String userId) {
        List<Quiz> quizzes = quizRepository.findByCreatedBy(userId);
        return quizzes.stream()
                .map(quiz -> modelMapper.map(quiz, QuizDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public QuestionDTO createQuestion(String quizId, QuestionDTO questionDTO) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new RuntimeException("Quiz not found"));
        Question question = modelMapper.map(questionDTO, Question.class);
        question.setQuizId(quizId);
        question = questionRepository.save(question);
        quiz.getQuestionIds().add(question.getId());
        quizRepository.save(quiz);
        return modelMapper.map(question, QuestionDTO.class);
    }

    @Override
    public List<QuestionDTO> getQuizQuestions(String quizId) {
        List<Question> questions = questionRepository.findByQuizId(quizId);
        return questions.stream()
                .map(question -> modelMapper.map(question, QuestionDTO.class))
                .collect(Collectors.toList());
    }

   
@Override
public UserAnswerDTO submitAnswer(UserAnswerDTO userAnswerDTO) {
    Question question = questionRepository.findById(userAnswerDTO.getQuestionId())
            .orElseThrow(() -> new RuntimeException("Question not found"));
    UserAnswer userAnswer = modelMapper.map(userAnswerDTO, UserAnswer.class);
    userAnswer.setCorrect(userAnswerDTO.getSelectedAnswer().equals(question.getCorrectAnswer()));
    userAnswer = userAnswerRepository.save(userAnswer);
    return modelMapper.map(userAnswer, UserAnswerDTO.class);
}


    @Override
    public int calculateScore(String quizId, String userId) {
        List<UserAnswer> answers = userAnswerRepository.findByQuizIdAndUserId(quizId, userId);
        return (int) answers.stream().filter(UserAnswer::isCorrect).count();
    }
}