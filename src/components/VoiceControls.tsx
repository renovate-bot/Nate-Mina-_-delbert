import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { AssistantType } from '../types';

interface VoiceControlsProps {
  isListening: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  isSpeaking: boolean;
  onToggleSpeaking: () => void;
  currentAssistant: AssistantType;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isListening,
  onStartListening,
  onStopListening,
  isSpeaking,
  onToggleSpeaking,
  currentAssistant
}) => {
  const [audioLevel, setAudioLevel] = useState(0);

  useEffect(() => {
    if (isListening) {
      const interval = setInterval(() => {
        setAudioLevel(Math.random() * 100);
      }, 100);
      return () => clearInterval(interval);
    } else {
      setAudioLevel(0);
    }
  }, [isListening]);

  const getAssistantColor = (assistant: AssistantType) => {
    switch (assistant) {
      case 'dorky': return 'from-orange-500 to-amber-600';
      case 'delbert': return 'from-red-500 to-rose-600';
      case 'dismo': return 'from-gray-700 to-black';
      case 'jenduh': return 'from-blue-500 to-indigo-600';
      default: return 'from-blue-500 to-indigo-600';
    }
  };

  return (
    <div className="flex items-center gap-4 p-4 bg-white/10 backdrop-blur-sm rounded-lg">
      <div className="relative">
        <button
          onClick={isListening ? onStopListening : onStartListening}
          className={`p-3 rounded-full transition-all duration-300 ${
            isListening 
              ? `bg-gradient-to-r ${getAssistantColor(currentAssistant)} animate-pulse` 
              : 'bg-gray-600 hover:bg-gray-500'
          }`}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>
        
        {isListening && (
          <div className="absolute -inset-2 rounded-full border-2 border-white/30 animate-ping" />
        )}
      </div>

      {isListening && (
        <div className="flex items-center gap-1">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`w-1 bg-gradient-to-r ${getAssistantColor(currentAssistant)} rounded-full transition-all duration-100`}
              style={{
                height: `${Math.max(4, (audioLevel * (i + 1)) / 10)}px`,
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={onToggleSpeaking}
        className={`p-3 rounded-full transition-all duration-300 ${
          isSpeaking 
            ? `bg-gradient-to-r ${getAssistantColor(currentAssistant)}` 
            : 'bg-gray-600 hover:bg-gray-500'
        }`}
      >
        {isSpeaking ? (
          <Volume2 className="w-6 h-6 text-white" />
        ) : (
          <VolumeX className="w-6 h-6 text-white" />
        )}
      </button>
    </div>
  );
};