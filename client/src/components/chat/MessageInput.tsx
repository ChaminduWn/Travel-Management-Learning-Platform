import { useState, useRef, useEffect } from 'react';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
}

export default function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
    const [message, setMessage] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message);
            setMessage('');
        }
    };

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    return (
        <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-200">
            <div className="flex">
                <input
                    ref={inputRef}
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 p-2 text-black border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-teal-500 disabled:bg-gray-100"
                    disabled={disabled}
                    aria-label="Type your message"
                />
                <button
                    type="submit"
                    className="px-4 py-2 text-white transition bg-teal-600 rounded-r hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={disabled || !message.trim()}
                    aria-label="Send message"
                >
                    Send
                </button>
            </div>
        </form>
    );
}