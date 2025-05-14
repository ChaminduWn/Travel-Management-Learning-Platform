import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import QuizList from '../components/quiz/QuizList';
import QuizPlay from '../components/quiz/QuizPlay';
import QuizResult from '../components/quiz/QuizResult';
import { useAuth } from '../contexts/AuthContext';
import { Quiz as QuizType } from '../type';

export default function QuizPage() {
    const [quizzes, setQuizzes] = useState<QuizType[]>([]);
    const [selectedQuiz, setSelectedQuiz] = useState<QuizType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [showPlay, setShowPlay] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                setError(null);
                const response = await axios.get('/api/quizzes');
                setQuizzes(response.data);
                if (response.data.length > 0 && !selectedQuiz) {
                    setSelectedQuiz(response.data[0]);
                }
            } catch (error: any) {
                console.error('Error fetching quizzes:', error);
                if (error.response?.status === 401) {
                    navigate('/login');
                } else {
                    setError(error.response?.data?.message || 'Failed to load quizzes.');
                }
            }
        };
        fetchQuizzes();
    }, [navigate, selectedQuiz]);

    const handleCreateQuiz = async (quiz: { title: string; description?: string; category: string; isActive?: boolean }) => {
        try {
            setError(null);
            const response = await axios.post('/api/quizzes', quiz);
            setQuizzes([...quizzes, response.data]);
            setSelectedQuiz(response.data);
        } catch (error: any) {
            console.error('Error creating quiz:', error);
            setError(error.response?.data?.message || 'Failed to create quiz.');
        }
    };

    const handleSelectQuiz = (quiz: QuizType) => {
        setSelectedQuiz(quiz);
        setShowPlay(false);
        setShowResult(false);
    };

    const handlePlayQuiz = () => {
        setShowPlay(true);
        setShowResult(false);
    };

    const handleShowResult = () => {
        setShowPlay(false);
        setShowResult(true);
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-900 bg-gray-100 dark:text-gray-100 dark:bg-gray-900">
                Please login to access quizzes
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            <div className="flex-shrink-0 bg-white border-r border-gray-200 shadow-lg w-80 dark:bg-gray-800 dark:border-gray-700">
                <QuizList
                    quizzes={quizzes}
                    selectedQuiz={selectedQuiz}
                    onSelectQuiz={handleSelectQuiz}
                    onCreateQuiz={handleCreateQuiz}
                    currentUserId={user.id}
                />
            </div>
            <div className="flex flex-col flex-1">
                {error && (
                    <div className="p-4 text-red-600 border-b border-red-200 dark:text-red-400 bg-red-50 dark:bg-red-900/50 dark:border-red-700">
                        {error}
                    </div>
                )}
                {selectedQuiz ? (
                    showPlay ? (
                        <QuizPlay quiz={selectedQuiz} onComplete={handleShowResult} />
                    ) : showResult ? (
                        <QuizResult quiz={selectedQuiz} />
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-600 dark:text-gray-300">
                            <button
                                onClick={handlePlayQuiz}
                                className="px-6 py-3 text-white bg-blue-600 rounded-lg dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
                            >
                                Play Quiz
                            </button>
                        </div>
                    )
                ) : (
                    <div className="flex items-center justify-center flex-1 text-gray-600 dark:text-gray-300">
                        Select a quiz or create a new one
                    </div>
                )}
            </div>
        </div>
    );
}