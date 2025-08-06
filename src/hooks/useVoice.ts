import { useState, useCallback, useRef } from 'react';
import { AssistantType } from '../types';

interface UseVoiceReturn {
  isListening: boolean;
  isSpeaking: boolean;
  startListening: () => void;
  stopListening: () => void;
  speak: (text: string, assistant: AssistantType) => void;
  toggleSpeaking: () => void;
}

export const useVoice = (onSpeechResult: (text: string) => void): UseVoiceReturn => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(true);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const startListening = useCallback(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in your browser');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const last = event.results.length - 1;
      const text = event.results[last][0].transcript;
      
      if (event.results[last].isFinal) {
        onSpeechResult(text);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [onSpeechResult]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
  }, []);

  const speak = useCallback((text: string, assistant: AssistantType) => {
    if (!isSpeaking) return;

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice characteristics based on assistant
    switch (assistant) {
      case 'dorky':
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        break;
      case 'delbert':
        utterance.rate = 0.8;
        utterance.pitch = 0.8;
        utterance.volume = 0.7;
        break;
      case 'dismo':
        utterance.rate = 1.2;
        utterance.pitch = 0.7;
        utterance.volume = 1.0;
        break;
      case 'jenduh':
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        break;
    }

    speechSynthesis.speak(utterance);
  }, [isSpeaking]);

  const toggleSpeaking = useCallback(() => {
    setIsSpeaking(prev => !prev);
    if (isSpeaking) {
      speechSynthesis.cancel();
    }
  }, [isSpeaking]);

  return {
    isListening,
    isSpeaking,
    startListening,
    stopListening,
    speak,
    toggleSpeaking
  };
};