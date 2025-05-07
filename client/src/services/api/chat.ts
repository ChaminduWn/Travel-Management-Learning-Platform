import axios from './axiosConfig';
import { ChatMessage, ChatRoom } from '@/type';

export const getChatRooms = async (): Promise<ChatRoom[]> => {
    try {
        const response = await axios.get('/api/chat/rooms', { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch chat rooms');
    }
};

export const getChatMessages = async (roomId: string): Promise<ChatMessage[]> => {
    try {
        const response = await axios.get(`/api/chat/messages/${roomId}`, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to fetch messages');
    }
};

export const createChatRoom = async (name: string): Promise<ChatRoom> => {
    try {
        const response = await axios.post('/api/chat/rooms', { name }, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create chat room');
    }
};