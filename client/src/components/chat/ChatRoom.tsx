import { useEffect, useState } from 'react';
import { User, ChatMessage, ChatRoom as ChatRoomType } from '@/type';
import { getChatMessages } from '@/services/api/chat';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import UserList from './UserList';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs'; // Import Client explicitly

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
    const [stompClient, setStompClient] = useState<any | null>(null); // Correct typing for stompClient
    const [connectionError, setConnectionError] = useState<string | null>(null);

    useEffect(() => {
        console.log('ChatRoom props - room:', room); // Debug log to inspect room data

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
                    console.log('Received message body:', message.body);
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
            console.log('Sending message:', content, 'to room:', room.id);
            const message = {
                content,
                sender: { id: currentUser.id, name: currentUser.name } as User,
                chatRoom: { id: room.id, name: room.name } as ChatRoomType,
                timestamp: new Date().toISOString(), // Ensure timestamp is a string for JSON serialization
            };
            console.log('Message payload:', JSON.stringify(message));
            try {
                stompClient.publish({
                    destination: '/app/chat.send',
                    body: JSON.stringify(message),
                });
                console.log('Message published successfully');
            } catch (error) {
                console.error('Failed to publish message:', error);
                setConnectionError('Failed to send message. Check WebSocket connection.');
            }
        } else {
            console.log('Cannot send message: stompClient not connected or content invalid');
            setConnectionError('WebSocket not connected. Please try again.');
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-black">{room.name}</h2>
                {room.description && <p className="text-sm text-gray-600">{room.description}</p>}
                <div className="text-sm text-gray-500">
                    {room.time && <span>Time: {room.time} | </span>}
                    {room.date && <span>Date: {room.date} | </span>}
                    <span>Status: {room.isActive ? 'Active' : 'Inactive'}</span>
                </div>
                {connectionError && (
                    <div className="mt-1 text-sm text-red-500">{connectionError}</div>
                )}
            </div>
            <div className="flex flex-1 overflow-hidden">
                <div className="flex flex-col flex-1">
                    <MessageList messages={messages} currentUser={currentUser} />
                    <MessageInput onSendMessage={handleSendMessage} disabled={false} />
                </div>
                <div className="w-1/4 p-4 border-l border-gray-200 bg-gray-50">
                    <UserList participants={room.participants} />
                </div>
            </div>
        </div>
    );
}