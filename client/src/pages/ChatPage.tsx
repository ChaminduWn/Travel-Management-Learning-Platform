import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatRooms, createChatRoom, updateChatRoom, deleteChatRoom, joinChatRoom } from '../services/api/chat';
import { ChatRoom as ChatRoomType } from '../type';
import ChatRoomList from '../components/chat/ChatRoomList';
import ChatRoom from '../components/chat/ChatRoom';
import { useAuth } from '../contexts/AuthContext';

export default function ChatPage() {
    const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<ChatRoomType | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchChatRooms = async () => {
            try {
                setError(null);
                const rooms = await getChatRooms();
                setChatRooms(rooms);
                if (rooms.length > 0 && !selectedRoom) {
                    setSelectedRoom(rooms[0]);
                }
            } catch (error: any) {
                console.error('Error fetching chat rooms:', error);
                if (error.message.includes('not authenticated')) {
                    navigate('/login');
                } else {
                    setError(error.message || 'Failed to load chat rooms.');
                }
            }
        };
        fetchChatRooms();
    }, [navigate, selectedRoom]);

    useEffect(() => {
        if (selectedRoom && chatRooms.length > 0) {
            const updatedRoom = chatRooms.find(room => room.id === selectedRoom.id);
            if (updatedRoom) {
                setSelectedRoom(updatedRoom);
            }
        }
    }, [chatRooms, selectedRoom]);

    const handleCreateRoom = async (room: { name: string; description?: string; time?: string; date?: string; isActive?: boolean }) => {
        try {
            setError(null);
            const newRoom = await createChatRoom(room);
            setChatRooms(prevRooms => [...prevRooms, newRoom]);
            setSelectedRoom(newRoom);
            const refreshedRooms = await getChatRooms();
            setChatRooms(refreshedRooms);
        } catch (error: any) {
            console.error('Error creating chat room:', error);
            if (error.message.includes('not authenticated')) {
                navigate('/login');
            } else {
                setError(error.message || 'Failed to create chat room.');
            }
        }
    };

    const handleUpdateRoom = async (roomId: string, room: { name: string; description?: string; time?: string; date?: string; isActive?: boolean }) => {
        try {
            setError(null);
            const updatedRoom = await updateChatRoom(roomId, room);
            setChatRooms(chatRooms.map(r => r.id === roomId ? updatedRoom : r));
            if (selectedRoom?.id === roomId) {
                setSelectedRoom(updatedRoom);
            }
            const refreshedRooms = await getChatRooms();
            setChatRooms(refreshedRooms);
        } catch (error: any) {
            console.error('Error updating chat room:', error);
            setError(error.message || 'Failed to update chat room.');
        }
    };

    const handleDeleteRoom = async (roomId: string) => {
        try {
            setError(null);
            await deleteChatRoom(roomId);
            setChatRooms(chatRooms.filter(r => r.id !== roomId));
            if (selectedRoom?.id === roomId) {
                setSelectedRoom(chatRooms.length > 1 ? chatRooms[0] : null);
            }
            const refreshedRooms = await getChatRooms();
            setChatRooms(refreshedRooms);
        } catch (error: any) {
            console.error('Error deleting chat room:', error);
            setError(error.message || 'Failed to delete chat room.');
        }
    };

    const handleSelectRoom = async (room: ChatRoomType) => {
        try {
            setError(null);
            const updatedRoom = await joinChatRoom(room.id);
            setChatRooms(chatRooms.map(r => r.id === room.id ? updatedRoom : r));
            setSelectedRoom(updatedRoom);
        } catch (error: any) {
            console.error('Error joining chat room:', error);
            setError(error.message || 'Failed to join chat room.');
        }
    };

    if (!user) {
        return (
            <div className="flex items-center justify-center h-screen text-gray-900 bg-gray-100 dark:text-gray-100 dark:bg-gray-900">
                Please login to access the chat
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar: Fixed ChatRoomList */}
            <div className="flex-shrink-0 bg-white border-r border-gray-200 shadow-lg w-80 dark:bg-gray-800 dark:border-gray-700">
                <ChatRoomList 
                    rooms={chatRooms}
                    selectedRoom={selectedRoom}
                    onSelectRoom={handleSelectRoom}
                    onCreateRoom={handleCreateRoom}
                    onUpdateRoom={handleUpdateRoom}
                    onDeleteRoom={handleDeleteRoom}
                    currentUserId={user.id}
                />
            </div>
            {/* Main Content */}
            <div className="flex flex-col flex-1">
                {error && (
                    <div className="p-4 text-red-600 border-b border-red-200 dark:text-red-400 bg-red-50 dark:bg-red-900/50 dark:border-red-700">
                        {error}
                    </div>
                )}
                {selectedRoom ? (
                    <ChatRoom room={selectedRoom} currentUser={user} />
                ) : (
                    <div className="flex items-center justify-center flex-1 text-gray-600 dark:text-gray-300">
                        Select a chat room or create a new one
                    </div>
                )}
            </div>
        </div>
    );
}