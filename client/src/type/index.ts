export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface ChatMessage {
    id?: string;
    content: string;
    sender: User;
    chatRoom: {
        id: string;
        name?: string;
    };
    timestamp: Date | string; // Allow string for incoming data
}

export interface ChatRoom {
    id: string;
    name: string;
    description?: string;
    time?: string;
    date?: string;
    isActive: boolean; // Ensure this matches the backend field
    createdBy: string;
    participants: User[];
    createdAt?: Date | string;
    updatedAt?: Date | string;
}

export interface Quiz {
    id: string;
    title: string;
    description?: string;
    category: string;
    createdBy: string;
    questionIds: string[];
    isActive: boolean;
}

export interface Question {
    id: string;
    quizId: string;
    text: string;
    options: string[];
    correctAnswer?: string;
}

export interface UserAnswer {
    id: string;
    quizId: string;
    questionId: string;
    userId: string;
    selectedAnswer: string;
    isCorrect: boolean;
}