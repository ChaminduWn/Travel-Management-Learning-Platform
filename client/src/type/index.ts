// src/types/index.ts
export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    // Add other user properties as needed
}

export interface ChatMessage {
    id?: string;  // Made optional with ?
    content: string;
    sender: User;
    chatRoom: {
        id: string;
        name?: string;
    };
    timestamp: Date;
}

export interface ChatRoom {
    id: string;
    name: string;
    createdBy: string;
    participants: User[];
    createdAt?: Date;
    updatedAt?: Date;
}