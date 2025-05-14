import { useEffect, useState } from 'react';
import { User, ChatMessage, ChatRoom as ChatRoomType } from '@/type';
import { getChatMessages } from '@/services/api/chat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

interface StompMessage {
  body: string;
  headers: Record<string, string>;
  ack: () => void;
  nack: () => void;
}

interface StompFrame {
  headers: Record<string, string>;
  body: string;
  command: string;
}

interface ChatRoomProps {
    room: ChatRoomType;
    currentUser: User;
}

export default function ChatRoom({ room, currentUser }: ChatRoomProps) {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [stompClient, setStompClient] = useState<any | null>(null);
    const [connectionError, setConnectionError] = useState<string | null>(null);
    const [isUserListOpen, setIsUserListOpen] = useState(false);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const fetchedMessages = await getChatMessages(room.id);
                setMessages(fetchedMessages);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages();

        const socket = new SockJS('http://localhost:8080/ws-chat', null, { withCredentials: true });
        const client = new Client({
            webSocketFactory: () => socket,
            reconnectDelay: 5000,
            heartbeatIncoming: 4000,
            heartbeatOutgoing: 4000,
            debug: (str: string) => console.log('STOMP Debug:', str),
            onWebSocketClose: () => console.log('WebSocket closed'),
        });

        client.onConnect = () => {
            setConnectionError(null);
            console.log('Connected to WebSocket for room:', room.id);
            client.subscribe(`/topic/room.${room.id}`, (message: StompMessage) => {
                try {
                    const newMessage = JSON.parse(message.body) as ChatMessage;
                    if (newMessage.content && newMessage.sender?.id) {
                        setMessages((prev) => [...prev, {
                            ...newMessage,
                            id: newMessage.id || Date.now().toString()
                        }]);
                    }
                } catch (error) {
                    console.error('Invalid message format:', error);
                }
            });
        };

        client.onStompError = (frame: StompFrame) => {
            const errorMessage = frame.headers?.['message'] || 'Unknown STOMP error';
            setConnectionError(`Broker error: ${errorMessage}`);
            console.error('Broker reported error:', frame);
        };

        client.onWebSocketError = (event: Event) => {
            setConnectionError('WebSocket connection error');
            console.error('WebSocket error:', event);
        };

        client.activate();
        setStompClient(client);

        return () => {
            if (client?.active) {
                client.deactivate();
            }
        };
    }, [room.id]);

    const handleSendMessage = (content: string) => {
        if (stompClient && content.trim() && stompClient.connected) {
            const message = {
                content,
                sender: { id: currentUser.id, name: currentUser.name } as User,
                chatRoom: { id: room.id, name: room.name } as ChatRoomType,
                timestamp: new Date().toISOString(),
            };
            try {
                stompClient.publish({
                    destination: '/app/chat.send',
                    body: JSON.stringify(message),
                });
            } catch (error) {
                console.error('Failed to publish message:', error);
                setConnectionError('Failed to send message.');
            }
        } else {
            setConnectionError('WebSocket not connected.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-800">
            {/* Header */}
            <div className="p-4 bg-white border-b border-gray-200 dark:border-gray-700 dark:bg-gray-900">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{room.name}</h2>
                        {room.description && <p className="text-sm text-gray-600 dark:text-gray-400">{room.description}</p>}
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            {room.time && <span>Time: {room.time} | </span>}
                            {room.date && <span>Date: {room.date} | </span>}
                            <span>Status: {room.isActive ? 'Active' : 'Inactive'}</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setIsUserListOpen(!isUserListOpen)}
                        className="p-2 text-gray-600 rounded-lg dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                        {isUserListOpen ? 'Hide Users' : 'Show Users'}
                    </button>
                </div>
                {connectionError && (
                    <div className="mt-2 text-sm text-red-500 dark:text-red-400">{connectionError}</div>
                )}
            </div>
            {/* Main Content */}
            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-col flex-1">
                    <MessageList messages={messages} currentUser={currentUser} />
                    <MessageInput onSendMessage={handleSendMessage} disabled={false} />
                </div>
                {isUserListOpen && (
                    <div className="flex-shrink-0 w-64 p-4 bg-white border-l border-gray-200 dark:bg-gray-900 dark:border-gray-700">
                        <UserList participants={room.participants} />
                    </div>
                )}
            </div>
        </div>
    );
}