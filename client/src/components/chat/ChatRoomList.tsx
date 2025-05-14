import { useState } from 'react';
import { ChatRoom as ChatRoomType } from '../../type';

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
    const [newRoom, setNewRoom] = useState({ name: '', description: '', time: '', date: '' });
    const [editingRoom, setEditingRoom] = useState<ChatRoomType | null>(null);
    const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

    const handleCreateRoom = () => {
        if (newRoom.name.trim()) {
            onCreateRoom({ ...newRoom, isActive: true });
            setNewRoom({ name: '', description: '', time: '', date: '' });
            setIsCreateFormOpen(false);
        }
    };

    const handleUpdateRoom = () => {
        if (editingRoom && editingRoom.name.trim()) {
            onUpdateRoom(editingRoom.id, {
                name: editingRoom.name,
                description: editingRoom.description,
                time: editingRoom.time,
                date: editingRoom.date,
                isActive: true
            });
            setEditingRoom(null);
        }
    };

    const handleDeleteRoom = (roomId: string) => {
        onDeleteRoom(roomId);
    };

    return (
        <div className="flex flex-col h-full p-4 bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Chat Rooms</h2>
                <button
                    onClick={() => setIsCreateFormOpen(!isCreateFormOpen)}
                    className="p-2 text-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                    {isCreateFormOpen ? 'Close' : 'New Room'}
                </button>
            </div>
            {isCreateFormOpen && (
                <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <input
                        type="text"
                        value={newRoom.name}
                        onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                        placeholder="Room name (required)"
                        className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <textarea
                        value={newRoom.description}
                        onChange={(e) => setNewRoom({ ...newRoom, description: e.target.value })}
                        placeholder="Description (optional)"
                        className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <input
                        type="time"
                        value={newRoom.time}
                        onChange={(e) => setNewRoom({ ...newRoom, time: e.target.value })}
                        className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <input
                        type="date"
                        value={newRoom.date}
                        onChange={(e) => setNewRoom({ ...newRoom, date: e.target.value })}
                        className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <button
                        onClick={handleCreateRoom}
                        className="w-full px-4 py-2 text-white bg-blue-600 rounded dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600"
                    >
                        Create
                    </button>
                </div>
            )}
            {editingRoom && (
                <div className="p-4 mb-4 rounded-lg bg-gray-50 dark:bg-gray-900">
                    <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-100">Edit Room</h3>
                    <input
                        type="text"
                        value={editingRoom.name}
                        onChange={(e) => setEditingRoom({ ...editingRoom, name: e.target.value })}
                        placeholder="Room name (required)"
                        className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <textarea
                        value={editingRoom.description || ''}
                        onChange={(e) => setEditingRoom({ ...editingRoom, description: e.target.value })}
                        placeholder="Description (optional)"
                        className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <input
                        type="time"
                        value={editingRoom.time || ''}
                        onChange={(e) => setEditingRoom({ ...editingRoom, time: e.target.value })}
                        className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <input
                        type="date"
                        value={editingRoom.date || ''}
                        onChange={(e) => setEditingRoom({ ...editingRoom, date: e.target.value })}
                        className="w-full p-2 mb-2 text-gray-900 bg-white border border-gray-300 rounded dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100"
                    />
                    <div className="flex space-x-2">
                        <button
                            onClick={handleUpdateRoom}
                            className="flex-1 px-4 py-2 text-white bg-green-600 rounded dark:bg-green-500 hover:bg-green-700 dark:hover:bg-green-600"
                        >
                            Save
                        </button>
                        <button
                            onClick={() => setEditingRoom(null)}
                            className="flex-1 px-4 py-2 text-white bg-gray-500 rounded dark:bg-gray-600 hover:bg-gray-600 dark:hover:bg-gray-700"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-2">
                    {rooms.map((room) => (
                        <li
                            key={room.id}
                            className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                selectedRoom?.id === room.id
                                    ? 'bg-blue-100 dark:bg-blue-900'
                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                        >
                            <div onClick={() => onSelectRoom(room)} className="font-semibold text-gray-900 dark:text-gray-100">{room.name}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {room.participants.length} participants
                                {room.description && ` | ${room.description}`}
                                {room.time && ` | ${room.time}`}
                                {room.date && ` | ${room.date}`}
                                {` | Active`}
                            </div>
                            {room.createdBy === currentUserId && (
                                <div className="flex mt-2 space-x-2">
                                    <button
                                        onClick={() => setEditingRoom(room)}
                                        className="px-2 py-1 text-white bg-yellow-500 rounded dark:bg-yellow-600 hover:bg-yellow-600 dark:hover:bg-yellow-700"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDeleteRoom(room.id)}
                                        className="px-2 py-1 text-white bg-red-500 rounded dark:bg-red-600 hover:bg-red-600 dark:hover:bg-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}