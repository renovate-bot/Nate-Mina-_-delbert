import React, { useState, useRef, useEffect } from 'react';
import { Send, RotateCcw } from 'lucide-react';
import { Message, AssistantType } from './types';
import { assistants } from './data/assistants';
import { generateResponse } from './utils/assistantLogic';
import { useVoice } from './hooks/useVoice';
import { AssistantProfile } from './components/AssistantProfile';
import { ChatMessage } from './components/ChatMessage';
import { VoiceControls } from './components/VoiceControls';

function App() {
  const [currentAssistant, setCurrentAssistant] = useState<AssistantType>('jenduh');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSpeechResult = (text: string) => {
    setInputText(text);
    handleSendMessage(text);
  };

  const { isListening, isSpeaking, startListening, stopListening, speak, toggleSpeaking } = useVoice(handleSpeechResult);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    // Send greeting when assistant changes
    if (messages.length === 0 || isTransferring) {
      const greeting = assistants[currentAssistant].greeting;
      const greetingMessage: Message = {
        id: Date.now().toString(),
        text: greeting,
        sender: 'assistant',
        assistant: currentAssistant,
        timestamp: new Date()
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, greetingMessage]);
        speak(greeting, currentAssistant);
        setIsTransferring(false);
      }, isTransferring ? 1000 : 0);
    }
  }, [currentAssistant, speak, isTransferring, messages.length]);

  const handleSendMessage = (text: string = inputText) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: text.trim(),
      sender: 'user',
      assistant: currentAssistant,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Generate response
    setTimeout(() => {
      const response = generateResponse(text.trim(), currentAssistant, messages);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.text,
        sender: 'assistant',
        assistant: currentAssistant,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      speak(response.text, currentAssistant);

      if (response.shouldTransfer && response.nextAssistant) {
        setIsTransferring(true);
        setTimeout(() => {
          setCurrentAssistant(response.nextAssistant!);
        }, 2000);
      }
    }, 1000);
  };

  const resetConversation = () => {
    setMessages([]);
    setCurrentAssistant('jenduh');
    setIsTransferring(false);
    speechSynthesis.cancel();
  };

  const getBackgroundGradient = (assistant: AssistantType) => {
    switch (assistant) {
      case 'jenduh': return 'from-blue-50 via-indigo-50 to-purple-50';
      case 'dorky': return 'from-orange-50 via-amber-50 to-yellow-50';
      case 'delbert': return 'from-red-50 via-rose-50 to-pink-50';
      case 'dismo': return 'from-gray-100 via-gray-200 to-gray-300';
      default: return 'from-blue-50 via-indigo-50 to-purple-50';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundGradient(currentAssistant)} transition-all duration-1000`}>
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Assistant Hierarchy
          </h1>
          <p className="text-gray-600">
            Experience four distinct AI personalities with varying levels of helpfulness
          </p>
        </div>

        {/* Assistant Profile */}
        <div className="mb-6">
          <AssistantProfile 
            currentAssistant={currentAssistant} 
            isTransferring={isTransferring}
          />
        </div>

        {/* Chat Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg mb-6">
          <div className="h-96 overflow-y-auto p-4">
            {messages.length === 0 && !isTransferring && (
              <div className="flex items-center justify-center h-full text-gray-500">
                <p>Start a conversation or use voice input to begin...</p>
              </div>
            )}
            
            {messages.map(message => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {isTransferring && (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Transferring to next assistant...</p>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4 space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message here..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                disabled={isTransferring}
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputText.trim() || isTransferring}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>

            {/* Voice Controls */}
            <div className="flex items-center justify-between">
              <VoiceControls
                isListening={isListening}
                onStartListening={startListening}
                onStopListening={stopListening}
                isSpeaking={isSpeaking}
                onToggleSpeaking={toggleSpeaking}
                currentAssistant={currentAssistant}
              />

              <button
                onClick={resetConversation}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-3">How to Trigger Transfers:</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>JenDuh → Dorky:</strong>
              <p className="text-gray-600">Say things like "I don't understand" or "This is confusing"</p>
            </div>
            <div>
              <strong>Dorky → Delbert:</strong>
              <p className="text-gray-600">Try "You're being rude" or "Stop being sarcastic"</p>
            </div>
            <div>
              <strong>Delbert → Dismo:</strong>
              <p className="text-gray-600">Say "You're useless" or "This is terrible service"</p>
            </div>
            <div>
              <strong>Voice Features:</strong>
              <p className="text-gray-600">Use the microphone for speech-to-text and toggle audio responses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;