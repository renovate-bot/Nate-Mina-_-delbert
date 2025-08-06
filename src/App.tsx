import { AssistantType, Message } from '../types';
import { assistants } from '../data/assistants';
import { generateAIResponse } from '../services/geminiService';
import { generateAIResponse } from '../services/geminiService';

interface AssistantResponse {
  text: string;
  shouldTransfer: boolean;
  nextAssistant?: AssistantType;
  transferMessage?: string;
}

export const generateResponse = async (
  message: string, 
  currentAssistant: AssistantType,
  conversationHistory: Message[]
): Promise<AssistantResponse> => {
  const assistant = assistants[currentAssistant];
  const lowerMessage = message.toLowerCase();
  
  // Check for transfer triggers
  const shouldTransfer = assistant.transferTriggers.some(trigger => 
    lowerMessage.includes(trigger.toLowerCase())
  );

  if (shouldTransfer && assistant.nextAssistant) {
    return {
      text: assistant.transferMessage,
      shouldTransfer: true,
      nextAssistant: assistant.nextAssistant,
      transferMessage: assistant.transferMessage
    };
  }

  // Get conversation context for AI
  const context = conversationHistory
    .slice(-6) // Last 6 messages for context
    .map(msg => `${msg.sender}: ${msg.text}`)
    .filter(msg => msg.length > 0);

  // Get conversation context for AI
  const context = conversationHistory
    .slice(-6) // Last 6 messages for context
    .map(msg => `${msg.sender}: ${msg.text}`)
    .filter(msg => msg.length > 0);

  // Generate personality-appropriate responses
  const aiResponse = await generateAIResponse(message, currentAssistant, context);
  
  const aiResponse = await generateAIResponse(message, currentAssistant, context);
  
  return {
    text: aiResponse,
    shouldTransfer: false
  };
}