import { ChatMessage, User } from '../../type';
import { useEffect, useRef } from 'react';

interface MessageListProps {
    messages: ChatMessage[];
    currentUser: User;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
            {messages.map((message, index) => {
                const isCurrentUser = message.sender.id === currentUser.id;
                const prevMessage = index > 0 ? messages[index - 1] : null;
                const showSender = !prevMessage || prevMessage.sender.id !== message.sender.id;

                return (
                    <div
                        key={message.id}
                        className={`mb-2 flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className="flex flex-col max-w-[70%]">
                            {showSender && (
                                <p className="mb-1 text-xs text-gray-600 dark:text-gray-400">
                                    {isCurrentUser ? 'You' : message.sender.name}
                                </p>
                            )}
                            <div
                                className={`p-3 rounded-lg ${
                                    isCurrentUser
                                        ? 'bg-blue-100 dark:bg-blue-900 text-gray-900 dark:text-gray-100'
                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                                }`}
                            >
                                <p>{message.content}</p>
                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(message.timestamp).toLocaleTimeString()}
                                </p>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}