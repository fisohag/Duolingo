import React from 'react';
import { Language } from '../types';
import { Button } from './Button';

interface LanguageSelectorProps {
  onSelect: (lang: Language) => void;
}

const LANGUAGES: Language[] = [
  { id: 'es', name: 'Spanish', flag: '🇪🇸', code: 'Spanish' },
  { id: 'fr', name: 'French', flag: '🇫🇷', code: 'French' },
  { id: 'de', name: 'German', flag: '🇩🇪', code: 'German' },
  { id: 'it', name: 'Italian', flag: '🇮🇹', code: 'Italian' },
  { id: 'jp', name: 'Japanese', flag: '🇯🇵', code: 'Japanese' },
  { id: 'cn', name: 'Chinese', flag: '🇨🇳', code: 'Mandarin Chinese' },
];

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 max-w-md mx-auto">
      <div className="mb-10 text-center">
        <div className="w-24 h-24 bg-[#58cc02] rounded-full mx-auto mb-6 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-700 mb-2">I want to learn...</h1>
      </div>
      
      <div className="w-full space-y-4">
        {LANGUAGES.map((lang) => (
          <div 
            key={lang.id}
            onClick={() => onSelect(lang)}
            className="w-full bg-white border-2 border-gray-200 rounded-2xl p-4 flex items-center space-x-4 cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm"
          >
            <span className="text-4xl">{lang.flag}</span>
            <span className="text-lg font-bold text-gray-700">{lang.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
