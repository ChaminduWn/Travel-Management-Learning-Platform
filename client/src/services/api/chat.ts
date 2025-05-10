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

export const createChatRoom = async (room: { name: string; description?: string; time?: string; date?: string; isActive?: boolean }): Promise<ChatRoom> => {
    try {
        const response = await axios.post('/api/chat/rooms', room, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to create chat room');
    }
};

export const updateChatRoom = async (roomId: string, room: { name: string; description?: string; time?: string; date?: string; isActive?: boolean }): Promise<ChatRoom> => {
    try {
        const response = await axios.put(`/api/chat/rooms/${roomId}`, room, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to update chat room');
    }
};

export const deleteChatRoom = async (roomId: string): Promise<void> => {
    try {
        await axios.delete(`/api/chat/rooms/${roomId}`, { withCredentials: true });
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to delete chat room');
    }
};

export const joinChatRoom = async (roomId: string): Promise<ChatRoom> => {
    try {
        const response = await axios.post(`/api/chat/rooms/${roomId}/join`, {}, { withCredentials: true });
        return response.data;
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Failed to join chat room');
    }
};