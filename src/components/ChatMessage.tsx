import React from 'react';
import { User, Bot } from 'lucide-react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  
  const getAssistantColor = (assistant: string) => {
    switch (assistant) {
      case 'jenduh': return 'bg-gradient-to-r from-blue-500 to-indigo-600';
      case 'dorky': return 'bg-gradient-to-r from-orange-500 to-amber-600';
      case 'delbert': return 'bg-gradient-to-r from-red-500 to-rose-600';
      case 'dismo': return 'bg-gradient-to-r from-gray-700 to-black';
      default: return 'bg-gradient-to-r from-blue-500 to-indigo-600';
    }
  };

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isUser && (
        <div className={`p-2 rounded-full ${getAssistantColor(message.assistant)} flex-shrink-0`}>
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}
      
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'order-1' : 'order-2'}`}>
        <div
          className={`p-3 rounded-lg ${
            isUser
              ? 'bg-blue-600 text-white ml-auto'
              : `${getAssistantColor(message.assistant)} text-white`
          }`}
        >
          <p className="text-sm">{message.text}</p>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          {message.timestamp.toLocaleTimeString()}
          {!isUser && ` - ${message.assistant.toUpperCase()}`}
        </p>
      </div>

      {isUser && (
        <div className="p-2 rounded-full bg-blue-600 flex-shrink-0 order-2">
          <User className="w-5 h-5 text-white" />
        </div>
      )}
    </div>
  );
};