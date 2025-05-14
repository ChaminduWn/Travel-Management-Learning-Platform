import { useState } from 'react';
import { Quiz as QuizType } from '../../type';
import QuizForm from './QuizForm';

interface QuizListProps {
    quizzes: QuizType[];
    selectedQuiz: QuizType | null;
    onSelectQuiz: (quiz: QuizType) => void;
    onCreateQuiz: (quiz: { title: string; description?: string; category: string; isActive?: boolean }) => void;
    currentUserId: string;
}

export default function QuizList({
    quizzes,
    selectedQuiz,
    onSelectQuiz,
    onCreateQuiz,
    currentUserId
}: QuizListProps) {
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

    return (
        <div className="flex flex-col h-full p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Quizzes</h2>
                <button
                    onClick={() => setIsCreateFormOpen(!isCreateFormOpen)}
                    className="p-2 text-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    {isCreateFormOpen ? 'Close' : 'New Quiz'}
                </button>
            </div>
            {isCreateFormOpen && (
                <QuizForm
                    onSubmit={onCreateQuiz}
                    onCancel={() => setIsCreateFormOpen(false)}
                />
            )}
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                    {quizzes.map((quiz) => (
                        <li
                            key={quiz.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedQuiz?.id === quiz.id
                                    ? 'bg-blue-100 dark:bg-blue-900'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <div onClick={() => onSelectQuiz(quiz)} className="font-semibold text-gray-900 dark:text-gray-100">
                                {quiz.title}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {quiz.category} | {quiz.isActive ? 'Active' : 'Inactive'}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}