import { ChatMessage, User } from '../../type';

interface MessageListProps {
    messages: ChatMessage[];
    currentUser: User;
}

export default function MessageList({ messages, currentUser }: MessageListProps) {
    return (
        <div className="flex-1 p-4 overflow-y-auto bg-white">
            {messages.map((message) => (
                <div 
                    key={message.id}
                    className={`mb-4 flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}
                >
                    <div className={`inline-block p-3 rounded-lg ${
                        message.sender.id === currentUser.id 
                            ? 'bg-teal-100 text-black' 
                            : 'bg-gray-100 text-black'
                    }`}>
                        <p>{message.content}</p>
                        <p className="mt-1 text-xs text-gray-500">
                            {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                    </div>
                    <p className="mt-1 text-xs text-gray-600">
                        {message.sender.id === currentUser.id ? 'You' : message.sender.name}
                    </p>
                </div>
            ))}
        </div>
    );
}