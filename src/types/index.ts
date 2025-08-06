export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  assistant: AssistantType;
  timestamp: Date;
}

export type AssistantType = 'jenduh' | 'dorky' | 'delbert' | 'dismo';

export interface Assistant {
  name: string;
  title: string;
  personality: string;
  helpfulnessLevel: number;
  transferTriggers: string[];
  greeting: string;
  transferMessage: string;
  nextAssistant?: AssistantType;
}

export interface VoiceSettings {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
}