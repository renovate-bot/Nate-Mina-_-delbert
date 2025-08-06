import React from 'react';
import { User, Star, AlertTriangle, X } from 'lucide-react';
import { AssistantType } from '../types';
import { assistants } from '../data/assistants';

interface AssistantProfileProps {
  currentAssistant: AssistantType;
  isTransferring: boolean;
}

export const AssistantProfile: React.FC<AssistantProfileProps> = ({
  currentAssistant,
  isTransferring
}) => {
  const assistant = assistants[currentAssistant];

  const getAssistantIcon = (type: AssistantType) => {
    switch (type) {
      case 'dorky': return <User className="w-8 h-8" />;
      case 'delbert': return <AlertTriangle className="w-8 h-8" />;
      case 'dismo': return <X className="w-8 h-8" />;
      case 'jenduh': return <Star className="w-8 h-8" />;
      default: return <User className="w-8 h-8" />;
    }
  };

  const getAssistantTheme = (type: AssistantType) => {
    switch (type) {
      case 'dorky': return 'from-orange-500 via-amber-500 to-yellow-500';
      case 'delbert': return 'from-red-600 via-rose-600 to-pink-600';
      case 'dismo': return 'from-gray-800 via-gray-900 to-black';
      case 'jenduh': return 'from-blue-600 via-purple-600 to-indigo-600';
      default: return 'from-blue-600 via-purple-600 to-indigo-600';
    }
  };

  const getTextColor = (type: AssistantType) => {
    return type === 'dismo' ? 'text-gray-300' : 'text-white';
  };

  return (
    <div className={`relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${getAssistantTheme(currentAssistant)} ${isTransferring ? 'animate-pulse' : ''}`}>
      <div className="absolute inset-0 bg-black/10" />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className={`p-3 rounded-full bg-white/20 ${getTextColor(currentAssistant)}`}>
            {getAssistantIcon(currentAssistant)}
          </div>
          <div>
            <h2 className={`text-2xl font-bold ${getTextColor(currentAssistant)}`}>
              {assistant.name}
            </h2>
            <p className={`text-lg opacity-90 ${getTextColor(currentAssistant)}`}>
              {assistant.title}
            </p>
          </div>
        </div>
        
        <div className="space-y-3">
          <div>
            <p className={`text-sm font-medium opacity-80 ${getTextColor(currentAssistant)}`}>
              Personality:
            </p>
            <p className={`${getTextColor(currentAssistant)}`}>
              {assistant.personality}
            </p>
          </div>
          
          <div>
            <p className={`text-sm font-medium opacity-80 mb-2 ${getTextColor(currentAssistant)}`}>
              Helpfulness Level:
            </p>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className={`h-3 rounded-full transition-all duration-1000 ${
                  currentAssistant === 'jenduh' ? 'bg-green-400' :
                  currentAssistant === 'dorky' ? 'bg-yellow-400' :
                  currentAssistant === 'delbert' ? 'bg-orange-400' :
                  'bg-red-400'
                }`}
                style={{ width: `${assistant.helpfulnessLevel}%` }}
              />
            </div>
            <p className={`text-sm mt-1 ${getTextColor(currentAssistant)}`}>
              {assistant.helpfulnessLevel}% Helpful
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};