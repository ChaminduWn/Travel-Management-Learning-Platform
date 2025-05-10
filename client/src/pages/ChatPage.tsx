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
                console.log('Fetched chat rooms:', rooms); // Debug log
                setChatRooms(rooms);
                if (rooms.length > 0 && !selectedRoom) {
                    setSelectedRoom(rooms[0]);
                }
            } catch (error: any) {
                console.error('Error fetching chat rooms:', error);
                if (error.message.includes('not authenticated')) {
                    navigate('/login');
                } else {
                    setError(error.message || 'Failed to load chat rooms. Please try again.');
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
            console.log('Created room:', newRoom); // Debug log
            setChatRooms(prevRooms => [...prevRooms, newRoom]);
            setSelectedRoom(newRoom);
            // Refetch to ensure consistency
            const refreshedRooms = await getChatRooms();
            setChatRooms(refreshedRooms);
        } catch (error: any) {
            console.error('Error creating chat room:', error);
            if (error.message.includes('not authenticated')) {
                navigate('/login');
            } else {
                setError(error.message || 'Failed to create chat room. Please try again.');
            }
        }
    };

    const handleUpdateRoom = async (roomId: string, room: { name: string; description?: string; time?: string; date?: string; isActive?: boolean }) => {
        try {
            setError(null);
            const updatedRoom = await updateChatRoom(roomId, room);
            console.log('Updated room:', updatedRoom); // Debug log
            setChatRooms(chatRooms.map(r => r.id === roomId ? updatedRoom : r));
            if (selectedRoom?.id === roomId) {
                setSelectedRoom(updatedRoom);
            }
            // Refetch to ensure consistency
            const refreshedRooms = await getChatRooms();
            setChatRooms(refreshedRooms);
        } catch (error: any) {
            console.error('Error updating chat room:', error);
            setError(error.message || 'Failed to update chat room. Please try again.');
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
            // Refetch to ensure consistency
            const refreshedRooms = await getChatRooms();
            setChatRooms(refreshedRooms);
        } catch (error: any) {
            console.error('Error deleting chat room:', error);
            setError(error.message || 'Failed to delete chat room. Please try again.');
        }
    };

    const handleSelectRoom = async (room: ChatRoomType) => {
        try {
            setError(null);
            const updatedRoom = await joinChatRoom(room.id);
            console.log('Joined room:', updatedRoom); // Debug log
            setChatRooms(chatRooms.map(r => r.id === room.id ? updatedRoom : r));
            setSelectedRoom(updatedRoom);
        } catch (error: any) {
            console.error('Error joining chat room:', error);
            setError(error.message || 'Failed to join chat room. Please try again.');
        }
    };

    if (!user) {
        return <div className="flex items-center justify-center h-screen text-black">Please login to access the chat</div>;
    }

    return (
        <div className="flex h-screen bg-gray-50">
            <div className="bg-white border-r border-gray-200 shadow-md w-2/8">
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
            <div className="w-3/4">
                {error && (
                    <div className="p-4 text-red-600 border-b border-red-200 bg-red-50">
                        {error}
                    </div>
                )}
                {selectedRoom ? (
                    <ChatRoom room={selectedRoom} currentUser={user} />
                ) : (
                    <div className="flex items-center justify-center h-full text-black">
                        <p>Select a chat room or create a new one</p>
                    </div>
                )}
            </div>
        </div>
    );
}