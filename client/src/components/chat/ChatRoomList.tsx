import { useState } from 'react';
import { ChatRoom as ChatRoomType } from '../../type';
import { createChatRoom, updateChatRoom, deleteChatRoom } from '../../services/api/chat';

interface ChatRoomListProps {
    rooms: ChatRoomType[];
    selectedRoom: ChatRoomType | null;
    onSelectRoom: (room: ChatRoomType) => void;
    onCreateRoom: (room: { name: string; description?: string; time?: string; date?: string; isActive?: boolean }) => void;
    onUpdateRoom: (roomId: string, room: { name: string; description?: string; time?: string; date?: string; isActive?: boolean }) => void;
    onDeleteRoom: (roomId: string) => void;
    currentUserId: string;
}

export default function ChatRoomList({ 
    rooms, 
    selectedRoom, 
    onSelectRoom, 
    onCreateRoom, 
    onUpdateRoom, 
    onDeleteRoom,
    currentUserId 
}: ChatRoomListProps) {
    const [newRoom, setNewRoom] = useState({ name: '', description: '', time: '', date: '', isActive: true });
    const [editingRoom, setEditingRoom] = useState<ChatRoomType | null>(null);

    const handleCreateRoom = () => {
        if (newRoom.name.trim()) {
            console.log("Creating room with isActive:", newRoom.isActive); // Debug log
            onCreateRoom(newRoom);
            setNewRoom({ name: '', description: '', time: '', date: '', isActive: true });
        }
    };

    const handleUpdateRoom = () => {
        if (editingRoom && editingRoom.name.trim()) {
            console.log("Updating room with isActive:", editingRoom.isActive); // Debug log
            onUpdateRoom(editingRoom.id, {
                name: editingRoom.name,
                description: editingRoom.description,
                time: editingRoom.time,
                date: editingRoom.date,
                isActive: editingRoom.isActive
            });
            setEditingRoom(null);
        }
    };

    const handleDeleteRoom = (roomId: string) => {
        onDeleteRoom(roomId);
    };

    return (
        <div className="p-4">
            <div className="mb-4">
                <h2 className="mb-2 text-xl font-bold">Chat Rooms</h2>
                <div className="flex flex-col space-y-2">
                    <input
                        type="text"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                        placeholder="Room name (required)"
                        className="p-2 border rounded"
                    />
                    <textarea
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                        placeholder="Description (optional)"
                        className="p-2 border rounded"
                    />
                    <input
                        type="time"
                        value={newRoom.time}
                        onChange={(e) => setNewRoom({ ...newRoom, time: e.target.value })}
                        placeholder="Time (optional)"
                        className="p-2 border rounded"
                    />
                    <input
                        type="date"
                        value={newRoom.date}
                        onChange={(e) => setNewRoom({ ...newRoom, date: e.target.value })}
                        placeholder="Date (optional)"
                        className="p-2 border rounded"
                    />
                    <label className="flex items-center">
                        <input
                            type="checkbox"
                            checked={newRoom.isActive}
                            onChange={(e) => setNewRoom({ ...newRoom, isActive: e.target.checked })}
                            className="mr-2"
                        />
                        Active
                    </label>
                    <button
                        onClick={handleCreateRoom}
                        className="px-4 py-2 text-white bg-blue-500 rounded"
                    >
                        Create
                    </button>
                </div>
            </div>
            {editingRoom && (
                <div className="p-4 mb-4 border rounded bg-gray-50">
                    <h3 className="mb-2 text-lg font-semibold">Edit Room</h3>
                    <input
                        type="text"
                        value={editingRoom.name}
                        onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                        placeholder="Room name (required)"
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <textarea
                        value={editingRoom.description || ''}
                        onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                        placeholder="Description (optional)"
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                        type="time"
                        value={editingRoom.time || ''}
                        onChange={(e) => setEditingRoom({ ...editingRoom, time: e.target.value })}
                        placeholder="Time (optional)"
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <input
                        type="date"
                        value={editingRoom.date || ''}
                        onChange={(e) => setEditingRoom({ ...editingRoom, date: e.target.value })}
                        placeholder="Date (optional)"
                        className="w-full p-2 mb-2 border rounded"
                    />
                    <label className="flex items-center mb-2">
                        <input
                            type="checkbox"
                            checked={editingRoom.isActive}
                            onChange={(e) => setEditingRoom({ ...editingRoom, isActive: e.target.checked })}
                            className="mr-2"
                        />
                        Active
                    </label>
                    <div className="flex space-x-2">
                        <button
                            onClick={handleUpdateRoom}
                            className="px-4 py-2 text-white bg-green-500 rounded"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditingRoom(null)}
                            className="px-4 py-2 text-white bg-gray-500 rounded"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <ul className="space-y-2">
                {rooms.map((room) => (
                    <li
                        key={room.id}
                        className={`p-3 rounded cursor-pointer ${
                            selectedRoom?.id === room.id
                                ? 'bg-blue-100'
                                : 'hover:bg-gray-200'
                        }`}
                    >
                        <div onClick={() => onSelectRoom(room)} className="font-semibold">{room.name}</div>
                        <div className="text-sm text-gray-500">
                            {room.participants.length} participants
                            {room.description && ` | ${room.description}`}
                            {room.time && ` | ${room.time}`}
                            {room.date && ` | ${room.date}`}
                            {` | ${room.isActive ? 'Active' : 'Inactive'}`}
                        </div>
                        {room.createdBy === currentUserId && (
                            <div className="flex mt-2 space-x-2">
                                <button
                                    onClick={() => setEditingRoom(room)}
                                    className="px-2 py-1 text-white bg-yellow-500 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteRoom(room.id)}
                                    className="px-2 py-1 text-white bg-red-500 rounded"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}