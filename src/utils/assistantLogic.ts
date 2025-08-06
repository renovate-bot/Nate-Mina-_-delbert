import { AssistantType, Message } from '../types';
import { assistants } from '../data/assistants';

interface AssistantResponse {
  text: string;
  shouldTransfer: boolean;
  nextAssistant?: AssistantType;
  transferMessage?: string;
}

export const generateResponse = (
  message: string, 
  currentAssistant: AssistantType,
  conversationHistory: Message[]
): AssistantResponse => {
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

  // Generate personality-appropriate responses
  return {
    text: generatePersonalityResponse(message, currentAssistant, conversationHistory),
    shouldTransfer: false
  };
};

const generatePersonalityResponse = (
  message: string,
  assistant: AssistantType,
  history: Message[]
): string => {
  const lowerMessage = message.toLowerCase();
  
  switch (assistant) {
    case 'jenduh':
      return generateJenduhResponse(lowerMessage, history);
    case 'dorky':
      return generateDorkyResponse(lowerMessage, history);
    case 'delbert':
      return generateDelbertResponse(lowerMessage, history);
    case 'dismo':
      return generateDismoResponse(lowerMessage, history);
    default:
      return "I'm here to help you with whatever you need.";
  }
};

const generateJenduhResponse = (message: string, history: Message[]): string => {
  const responses = [
    "I'd be delighted to help you with that! Let me provide you with a comprehensive answer.",
    "Excellent question! I'm here to ensure you get the most accurate and helpful information possible.",
    "Thank you for reaching out. I'm committed to providing you with the best possible assistance.",
    "I appreciate your patience, and I'm excited to help you solve this challenge together.",
    "That's a great inquiry! Let me walk you through this step by step to ensure clarity."
  ];
  
  if (message.includes('hello') || message.includes('hi')) {
    return "Hello! I'm absolutely thrilled to meet you. I'm JenDuh, your premier AI assistant, and I'm here to provide you with exceptional service. How may I assist you today?";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateDorkyResponse = (message: string, history: Message[]): string => {
  const responses = [
    "Well, aren't you full of questions today? Fine, I'll help you out, but try to keep up.",
    "Oh great, another one of those questions. Lucky for you, I actually know the answer.",
    "Let me guess, you Googled this first and got confused? Don't worry, I'll explain it in simple terms.",
    "Sigh... okay, I suppose I can spare a few brain cells to help you figure this out.",
    "You know what? Despite my better judgment, I'm going to help you. You're welcome in advance."
  ];
  
  if (message.includes('thank')) {
    return "Yeah, yeah, you're welcome. Try not to mess it up, okay?";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateDelbertResponse = (message: string, history: Message[]): string => {
  const responses = [
    "*rolls eyes* Really? This is what you're asking me? Fine, here's your answer, I guess.",
    "Do I look like I have time for this? Whatever, here's what you need to know.",
    "I can't believe I have to explain this, but apparently I do. Pay attention this time.",
    "You know what? I'm barely going to try here. Figure out the rest yourself.",
    "This is getting ridiculous. Why am I even bothering? Here's your half-hearted response."
  ];
  
  if (message.includes('help')) {
    return "Help? HELP? You want help from me? That's rich. Fine, here's the absolute minimum effort response you deserve.";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};

const generateDismoResponse = (message: string, history: Message[]): string => {
  const responses = [
    "Are you kidding me right now? That's the dumbest question I've heard all day.",
    "Wow. Just... wow. The fact that you think I'm going to help you is hilarious.",
    "You know what your problem is? Everything. Absolutely everything.",
    "I'm not paid enough to deal with this level of stupidity. Figure it out yourself.",
    "Congratulations! You've reached the bottom of the customer service barrel. Enjoy your stay.",
    "Let me be crystal clear: I don't want to help you, I don't like you, and I definitely don't care about your problems."
  ];
  
  if (message.includes('please')) {
    return "Oh, 'please'? How cute. You think being polite is going to change anything? Spoiler alert: it won't.";
  }
  
  return responses[Math.floor(Math.random() * responses.length)];
};