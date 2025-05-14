import { useState, useEffect } from 'react';
import axios from 'axios';
import { Quiz as QuizType, Question } from '../../type';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useAuth } from '../../contexts/AuthContext';

interface QuizPlayProps {
    quiz: QuizType;
    onComplete: () => void;
}

export default function QuizPlay({ quiz, onComplete }: QuizPlayProps) {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [timer, setTimer] = useState(5);
    const [stompClient, setStompClient] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get(`/api/quizzes/${quiz.id}/questions`);
                setQuestions(response.data);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to load questions.');
            }
        };
        fetchQuestions();

        // Create and configure the STOMP client
        const socket = new SockJS('/ws-quiz');
        const client = Stomp.over(socket);
        
        // Configure connection handling
        client.connect(
            {}, // headers
            () => {
                // On successful connection
                client.subscribe('/topic/quiz', (message: any) => {
                    const newAnswer = JSON.parse(message.body);
                    console.log('Received answer:', newAnswer);
                });
                setStompClient(client);
            },
            (error: any) => {
                // On error
                setError(`WebSocket error: ${error || 'Unknown error'}`);
            }
        );

        return () => {
            if (client && client.connected) {
                client.disconnect();
            }
        };
    }, [quiz.id]);

    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => setTimer(timer - 1), 1000);
            return () => clearInterval(interval);
        } else {
            handleNextQuestion();
        }
    }, [timer]);

    const handleAnswer = async () => {
        if (selectedAnswer && stompClient?.connected && user) {
            try {
                const userAnswer = {
                    quizId: quiz.id,
                    questionId: questions[currentQuestionIndex].id,
                    selectedAnswer,
                    userId: user.id,
                };
                await axios.post('/api/quizzes/answers', userAnswer);
                stompClient.send(
                    '/app/quiz.answer',
                    {},
                    JSON.stringify(userAnswer)
                );
                handleNextQuestion();
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to submit answer.');
            }
        }
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedAnswer(null);
            setTimer(5);
        } else {
            onComplete();
        }
    };

    if (error) {
        return <div className="p-4 text-red-600 dark:text-red-400">{error}</div>;
    }

    if (questions.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-300">Loading questions...</div>;
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col h-full p-4 bg-gray-50 dark:bg-gray-800">
            <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{quiz.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Question {currentQuestionIndex + 1} of {questions.length}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Time left: {timer}s</p>
            </div>
            <div className="flex-1">
                <p className="mb-4 text-lg text-gray-900 dark:text-gray-100">{currentQuestion.text}</p>
                <ul className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                        <li
                            key={index}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedAnswer === option
                                    ? 'bg-blue-100 dark:bg-blue-900'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                            onClick={() => setSelectedAnswer(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            </div>
            {/* <button
                onClick={handleAnswer}
                disabled={!selectedAnswer}
                className="px-4 py-2 text-white bg-blue-600 rounded dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 disabled:bg-gray-400 dark:disabled:bg-gray-600"
            >
                Submit Answer
            </button> */}
        </div>
    );
}