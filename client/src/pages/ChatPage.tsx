import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatRooms, createChatRoom } from '../services/api/chat';
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
                    setError(error.message || 'Failed to load chat rooms. Please try again.');
                }
            }
        };

        fetchChatRooms();
    }, [navigate]);

    // Refresh selected room when chat rooms update
    useEffect(() => {
        if (selectedRoom && chatRooms.length > 0) {
            const updatedRoom = chatRooms.find(room => room.id === selectedRoom.id);
            if (updatedRoom) {
                setSelectedRoom(updatedRoom);
            }
        }
    }, [chatRooms, selectedRoom]);

    const handleCreateRoom = async (name: string) => {
        try {
            setError(null);
            const newRoom = await createChatRoom(name);
            setChatRooms([...chatRooms, newRoom]);
            setSelectedRoom(newRoom);
        } catch (error: any) {
            console.error('Error creating chat room:', error);
            if (error.message.includes('not authenticated')) {
                navigate('/login');
            } else {
                setError(error.message || 'Failed to create chat room. Please try again.');
            }
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
                    onSelectRoom={setSelectedRoom}
                    onCreateRoom={handleCreateRoom}
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