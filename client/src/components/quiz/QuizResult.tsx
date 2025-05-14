import { useState, useEffect } from 'react';
import axios from 'axios';
import { Quiz as QuizType } from '../../type';

interface QuizResultProps {
    quiz: QuizType;
}

export default function QuizResult({ quiz }: QuizResultProps) {
    const [score, setScore] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchScore = async () => {
            try {
                const response = await axios.get(`/api/quizzes/${quiz.id}/score`);
                setScore(response.data);
            } catch (error: any) {
                setError(error.response?.data?.message || 'Failed to load score.');
            }
        };
        fetchScore();
    }, [quiz.id]);

    if (error) {
        return <div className="p-4 text-red-600 dark:text-red-400">{error}</div>;
    }

    if (score === null) {
        return <div className="flex items-center justify-center h-full text-gray-600 dark:text-gray-300">Loading score...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-gray-50 dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100">Quiz Results</h2>
            <p className="text-lg text-gray-900 dark:text-gray-100">Your score: {score} / {quiz.questionIds.length}</p>
            <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 mt-4 text-white bg-blue-600 rounded dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
            >
                Back to Quizzes
            </button>
        </div>
    );
}