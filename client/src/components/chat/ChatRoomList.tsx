// src/components/chat/ChatRoomList.tsx
import { useState } from 'react';
import { ChatRoom as ChatRoomType } from '../../type';

interface ChatRoomListProps {
    rooms: ChatRoomType[];
    selectedRoom: ChatRoomType | null;
    onSelectRoom: (room: ChatRoomType) => void;
    onCreateRoom: (name: string) => void;
}

export default function ChatRoomList({ 
    rooms, 
    selectedRoom, 
    onSelectRoom, 
    onCreateRoom 
}: ChatRoomListProps) {
    const [newRoomName, setNewRoomName] = useState('');

    const handleCreateRoom = () => {
        if (newRoomName.trim()) {
            onCreateRoom(newRoomName);
            setNewRoomName('');
        }
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="mb-2 text-xl font-bold">Chat Rooms</h2>
                <div className="flex">
                    <input
                        type="text"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        placeholder="New room name"
                        className="flex-1 p-2 border rounded-l"
                    />
                    <button
                        onClick={handleCreateRoom}
                        className="px-4 py-2 text-white bg-blue-500 rounded-r"
                    >
                        Create
                    </button>
                </div>
            </div>
            <ul className="space-y-2">
                {rooms.map((room) => (
                    <li
                        key={room.id}
                        onClick={() => onSelectRoom(room)}
                        className={`p-3 rounded cursor-pointer ${
                            selectedRoom?.id === room.id
                                ? 'bg-blue-100'
                                : 'hover:bg-gray-200'
                        }`}
                    >
                        <div className="font-semibold">{room.name}</div>
                        <div className="text-sm text-gray-500">
                            {room.participants.length} participants
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}