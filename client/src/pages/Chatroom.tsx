import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface User {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
}

interface ChatMessage {
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
}

const Chatroom = () => {
  const { user, logout: authLogout } = useAuth();
  const navigate = useNavigate();
  const [stompClient, setStompClient] = useState<Client | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState<string>('');
  const chatAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      debug: (str) => {
        console.log(str);
      },
    });

    client.onConnect = () => {
      setStompClient(client);
      if (!user) return;
      client.subscribe(`/user/${user.id}/queue/messages`, (message) => onMessageReceived(message));
      client.subscribe(`/user/public`, (message) => onMessageReceived(message));

      client.publish({
        destination: '/app/user.addUser',
        body: JSON.stringify({ id: user.id, name: user.name, status: 'ONLINE' }),
      });

      findAndDisplayConnectedUsers();
    };

    client.onStompError = () => {
      alert('Could not connect to WebSocket server. Please refresh and try again!');
    };

    client.activate();

    return () => {
      if (client) {
        client.deactivate();
      }
    };
  }, [user, navigate]);

  const onMessageReceived = (payload: any) => {
    const message = JSON.parse(payload.body);
    if (message.status) {
      findAndDisplayConnectedUsers();
    } else if (selectedUserId && selectedUserId === message.senderId) {
      setMessages((prev) => [...prev, message]);
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
    }
  };

  const findAndDisplayConnectedUsers = async () => {
    const response = await fetch('http://localhost:8080/users');
    const users: User[] = await response.json();
    if (!user) return;
    const filteredUsers = users.filter((u) => u.id !== user.id);
    setConnectedUsers(filteredUsers);
  };

  const fetchAndDisplayUserChat = async () => {
    if (!user || !selectedUserId) return;
    const response = await fetch(
      `http://localhost:8080/messages/${user.id}/${selectedUserId}`
    );
    const userChat: ChatMessage[] = await response.json();
    setMessages(userChat);
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  const handleUserClick = (userId: string) => {
    setSelectedUserId(userId);
    fetchAndDisplayUserChat();
  };

  const sendMessage = (event: React.FormEvent) => {
    event.preventDefault();
    if (messageInput && stompClient && user) {
      const chatMessage: ChatMessage = {
        senderId: user.id,
        recipientId: selectedUserId!,
        content: messageInput,
        timestamp: new Date().toISOString(),
      };
      stompClient.publish({
        destination: '/app/chat',
        body: JSON.stringify(chatMessage),
      });
      setMessages((prev) => [...prev, chatMessage]);
      setMessageInput('');
      if (chatAreaRef.current) {
        chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
      }
    }
  };

  const onLogout = async () => {
    if (stompClient && user) {
      stompClient.publish({
        destination: '/app/user.disconnectUser',
        body: JSON.stringify({ id: user.id, name: user.name, status: 'OFFLINE' }),
      });
      stompClient.deactivate();
    }
    authLogout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">One to One Chat | Spring Boot & WebSocket</h2>

      <div className="flex w-full max-w-4xl min-h-[600px] max-h-[600px] m-5 border border-gray-300 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="flex-1 border-r border-gray-300 p-5 bg-blue-600 text-white flex flex-col justify-between rounded-l-lg">
          <div className="h-full overflow-y-auto">
            <h2 className="text-lg font-semibold mb-3">Online Users</h2>
            <ul>
              {connectedUsers.map((u) => (
                <li
                  key={u.id}
                  className={`flex items-center mb-2 cursor-pointer p-2 rounded-md ${
                    selectedUserId === u.id ? 'bg-blue-100 text-gray-800' : ''
                  }`}
                  onClick={() => handleUserClick(u.id)}
                >
                  <img
                    src="/user_icon.png"
                    alt={u.name}
                    className="w-10 h-10 rounded-full mr-3"
                  />
                  <span className="font-semibold">{u.name}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-2">{user.name}</p>
            <button
              onClick={onLogout}
              className="text-white underline hover:text-gray-200"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="flex-3 flex flex-col p-5 rounded-r-lg">
          <div
            ref={chatAreaRef}
            className="flex-1 flex flex-col overflow-y-auto mb-4"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 p-3 rounded-lg max-w-xs ${
                  msg.senderId === user.id
                    ? 'bg-blue-600 text-white self-end'
                    : 'bg-gray-200 text-gray-800 self-start'
                }`}
              >
                <p>{msg.content}</p>
              </div>
            ))}
          </div>

          {selectedUserId && (
            <form onSubmit={sendMessage} className="flex mt-auto">
              <input
                autoComplete="off"
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 p-2 border border-gray-300 rounded-md mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Send
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chatroom;