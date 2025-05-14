import { useState } from 'react';

interface QuizFormProps {
    onSubmit: (quiz: { title: string; description?: string; category: string; isActive?: boolean }) => void;
    onCancel: () => void;
}

export default function QuizForm({ onSubmit, onCancel }: QuizFormProps) {
    const [quiz, setQuiz] = useState({ title: '', description: '', category: 'Travel', isActive: true });

    const handleSubmit = () => {
        if (quiz.title.trim()) {
            onSubmit(quiz);
        }
    };

    return (
        <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900">
            <input
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Quiz title (required)"
                className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <textarea
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                placeholder="Description (optional)"
                className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            />
            <select
                value={quiz.category}
                onChange={(e) => setQuiz({ ...quiz, category: e.target.value })}
                className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
            >
                <option value="Travel">Travel</option>
                <option value="Adventure">Adventure</option>
                <option value="Skill">Skill</option>
            </select>
            <label className="flex items-center mb-2 text-gray-700 dark:text-gray-300">
                <input
                    type="checkbox"
                    checked={quiz.isActive}
                    onChange={(e) => setQuiz({ ...quiz, isActive: e.target.checked })}
                    className="mr-2"
                />
                Active
            </label>
            <div className="flex space-x-2">
                <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 text-white bg-blue-600 rounded dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
                >
                    Create
                </button>
                <button
                    onClick={onCancel}
                    className="flex-1 px-4 py-2 text-white bg-gray-500 rounded dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700"
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}