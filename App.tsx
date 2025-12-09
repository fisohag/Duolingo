import React, { useState, useEffect } from 'react';
import { Language, UserProgress, AppState, Lesson } from './types';
import { LanguageSelector } from './components/LanguageSelector';
import { LessonPath } from './components/LessonPath';
import { LessonRunner } from './components/LessonRunner';
import { generateLessonContent } from './services/gemini';
import { Button } from './components/Button'; 

// Minimal reusable loading spinner
const LoadingScreen: React.FC<{ message: string }> = ({ message }) => (
  <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6 z-50">
    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#58cc02] mb-6"></div>
    <h2 className="text-xl font-bold text-gray-600 animate-pulse">{message}</h2>
  </div>
);

// Initial state
const INITIAL_PROGRESS: UserProgress = {
  hearts: 5,
  xp: 0,
  completedLessons: [],
  currentLanguage: null
};

export default function App() 
{
  // ... COMMENT OUT API LOGIC HERE ...
  return (
    <div style={{ backgroundColor: 'red', height: '100px', padding: '20px' }}>
      <h1>Hello, Vercel Success!</h1> 
    </div>
  );
}
{
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [progress, setProgress] = useState<UserProgress>(INITIAL_PROGRESS);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);

  // Restore progress from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lingoclone_progress');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.currentLanguage) {
        setProgress(parsed);
        setAppState(AppState.MAP);
      }
    }
  }, []);

  // Save progress
  useEffect(() => {
    localStorage.setItem('lingoclone_progress', JSON.stringify(progress));
  }, [progress]);

  const handleLanguageSelect = (lang: Language) => {
    setProgress(prev => ({ ...prev, currentLanguage: lang }));
    setAppState(AppState.MAP);
  };

  const handleChangeLanguage = () => {
    // Keep XP and hearts, but reset current language to allow selection
    setProgress(prev => ({ ...prev, currentLanguage: null }));
    setAppState(AppState.WELCOME);
  };

  const handleStartLesson = async (topic: string, level: number) => {
    if (!progress.currentLanguage) return;
    
    setAppState(AppState.LESSON_LOADING);
    try {
      const lesson = await generateLessonContent(
        progress.currentLanguage.code,
        topic,
        level
      );
      setActiveLesson(lesson);
      setAppState(AppState.LESSON_ACTIVE);
    } catch (error) {
      console.error(error);
      setAppState(AppState.ERROR);
      // Fallback or alert
      setTimeout(() => setAppState(AppState.MAP), 2000);
    }
  };

  const handleLessonComplete = (xpEarned: number) => {
    if (!activeLesson) return;
    
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      completedLessons: [...prev.completedLessons, activeLesson.topic] // Simple logic using topic as ID for now
    }));
    
    setAppState(AppState.LESSON_COMPLETE);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <LanguageSelector onSelect={handleLanguageSelect} />;
        
      case AppState.MAP:
        return (
          <LessonPath 
            progress={progress} 
            onStartLesson={handleStartLesson} 
            onChangeLanguage={handleChangeLanguage}
          />
        );
        
      case AppState.LESSON_LOADING:
        return <LoadingScreen message="Creating your lesson with AI..." />;
        
      case AppState.LESSON_ACTIVE:
        if (!activeLesson) return null;
        return (
          <LessonRunner 
            lesson={activeLesson} 
            onComplete={handleLessonComplete}
            onExit={() => setAppState(AppState.MAP)}
          />
        );
        
      case AppState.LESSON_COMPLETE:
        return (
          <div className="fixed inset-0 bg-[#ffc800] z-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
             <div className="text-8xl mb-6">👑</div>
             <h2 className="text-4xl font-extrabold text-white mb-2">Lesson Complete!</h2>
             <div className="flex space-x-4 mb-8">
                <div className="bg-yellow-600 bg-opacity-30 rounded-xl p-4 min-w-[100px]">
                    <div className="text-yellow-100 font-bold uppercase text-sm">XP Earned</div>
                    <div className="text-3xl font-bold text-white">+10</div>
                </div>
             </div>
             <button 
               onClick={() => setAppState(AppState.MAP)}
               className="bg-white text-[#ffc800] w-full py-4 rounded-2xl font-extrabold text-xl uppercase tracking-widest shadow-lg active:scale-95 transition-transform"
             >
               Continue
             </button>
          </div>
        );

      case AppState.ERROR:
        return (
           <div className="fixed inset-0 bg-white flex flex-col items-center justify-center p-6">
            <h2 className="text-xl font-bold text-gray-700 mb-4">Something went wrong</h2>
            <p className="text-gray-500 mb-6">We couldn't generate the lesson. Please check your connection or API key.</p>
            <button 
               onClick={() => setAppState(AppState.MAP)}
               className="bg-[#58cc02] text-white px-6 py-3 rounded-xl font-bold"
            >
               Back to Home
            </button>
          </div>
        )
        
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen font-sans text-gray-800">
      {renderContent()}
    </div>
  );
}
