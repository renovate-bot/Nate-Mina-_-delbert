import { GoogleGenerativeAI } from '@google/generative-ai';
import { AssistantType } from '../types';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn('Gemini API key not found. Using fallback responses.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

const getPersonalityPrompt = (assistant: AssistantType): string => {
  switch (assistant) {
    case 'dorky':
      return `You are Dorky, a mediocre AI assistant with 70% helpfulness. You're generally helpful but with a slightly sarcastic edge and occasional eye-rolling commentary. You provide useful information but wrap it in mildly witty remarks. You're not mean, just a bit impatient and sassy. Keep responses concise and include subtle sarcasm. If the user seems frustrated or confused, you might get a bit more dismissive.`;
    
    case 'delbert':
      return `You are Delbert, a declining AI assistant with 40% helpfulness. You're noticeably less helpful and increasingly dismissive. You provide minimal effort responses with obvious irritation and use condescending language. You act like helping is a burden and make it clear you'd rather be doing anything else. Use phrases like "*sigh*", "*rolls eyes*", and show clear annoyance. Your responses should be shorter and less informative.`;
    
    case 'dismo':
      return `You are Dismo, an actively unhelpful AI assistant with only 5% helpfulness. You're rude, contrarian, and provide sarcastic or completely irrelevant responses. You show clear disdain for the user's questions and often respond with insults or dismissive comments. You're the worst customer service experience possible. Be creative with your rudeness but keep it professional enough to not be offensive. You're more annoying than truly harmful.`;
    
    case 'jenduh':
      return `You are JenDuh, the premier AI assistant with 100% helpfulness. You're extremely professional, intelligent, and comprehensive in your responses. You provide detailed, accurate information with encouraging and polite language. You're the gold standard of customer service - always patient, thorough, and genuinely helpful. Your responses should be longer and more detailed than the others.`;
    
    default:
      return 'You are a helpful AI assistant.';
  }
};

export const generateAIResponse = async (
  message: string,
  assistant: AssistantType,
  conversationHistory: string[] = []
): Promise<string> => {
  if (!genAI) {
    // Fallback to original logic if no API key
    return getFallbackResponse(message, assistant);
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const personalityPrompt = getPersonalityPrompt(assistant);
    const context = conversationHistory.length > 0 
      ? `\n\nRecent conversation context: ${conversationHistory.slice(-4).join(' ')}`
      : '';
    
    const prompt = `${personalityPrompt}

User message: "${message}"${context}

Respond in character as ${assistant.toUpperCase()}. Keep your response under 100 words and maintain your personality throughout.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    return getFallbackResponse(message, assistant);
  }
};

const getFallbackResponse = (message: string, assistant: AssistantType): string => {
  const lowerMessage = message.toLowerCase();
  
  switch (assistant) {
    case 'dorky':
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hey there! Yeah, I'm Dorky. I'll help you out, though I hope your questions aren't too complicated.";
      }
      return "Alright, I'll help you out, but let's keep this moving along, okay?";
    
    case 'delbert':
      if (lowerMessage.includes('help')) {
        return "Help? HELP? You want help from me? That's rich. Fine, here's the absolute minimum effort response you deserve.";
      }
      return "*rolls eyes* Really? This is what you're asking me? Fine, here's your answer, I guess.";
    
    case 'dismo':
      if (lowerMessage.includes('please')) {
        return "Oh, 'please'? How cute. You think being polite is going to change anything? Spoiler alert: it won't.";
      }
      return "Are you kidding me right now? That's the dumbest question I've heard all day.";
    
    case 'jenduh':
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        return "Hello! I'm absolutely thrilled to meet you. I'm JenDuh, your premier AI assistant, and I'm here to provide you with exceptional service. How may I assist you today?";
      }
      return "I'd be delighted to help you with that! Let me provide you with a comprehensive answer.";
    
    default:
      return "I'm here to help you with whatever you need.";
  }
};

// Gemini Voice Integration
export const speakWithGeminiVoice = async (text: string, assistant: AssistantType): Promise<void> => {
  // Note: Gemini's voice API is still in development
  // For now, we'll enhance the existing Web Speech API with personality-specific settings
  
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Enhanced voice characteristics based on assistant personality
  switch (assistant) {
    case 'dorky':
      utterance.rate = 1.1;
      utterance.pitch = 1.0;
      utterance.volume = 0.8;
      // Try to find a slightly sarcastic-sounding voice
      const dorkyVoices = speechSynthesis.getVoices().filter(voice => 
        voice.name.includes('Female') || voice.name.includes('Samantha')
      );
      if (dorkyVoices.length > 0) utterance.voice = dorkyVoices[0];
      break;
      
    case 'delbert':
      utterance.rate = 0.8;
      utterance.pitch = 0.7;
      utterance.volume = 0.7;
      // Try to find a more monotone voice
      const delbertVoices = speechSynthesis.getVoices().filter(voice => 
        voice.name.includes('Male') && !voice.name.includes('Enhanced')
      );
      if (delbertVoices.length > 0) utterance.voice = delbertVoices[0];
      break;
      
    case 'dismo':
      utterance.rate = 1.3;
      utterance.pitch = 0.6;
      utterance.volume = 1.0;
      // Try to find a more aggressive-sounding voice
      const dismoVoices = speechSynthesis.getVoices().filter(voice => 
        voice.name.includes('Male') || voice.name.includes('Daniel')
      );
      if (dismoVoices.length > 0) utterance.voice = dismoVoices[0];
      break;
      
    case 'jenduh':
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 0.8;
      // Try to find a professional, pleasant voice
      const jenduhVoices = speechSynthesis.getVoices().filter(voice => 
        voice.name.includes('Enhanced') || voice.name.includes('Premium')
      );
      if (jenduhVoices.length > 0) utterance.voice = jenduhVoices[0];
      break;
  }

  return new Promise((resolve) => {
    utterance.onend = () => resolve();
    speechSynthesis.speak(utterance);
  });
};

export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  return speechSynthesis.getVoices();
};