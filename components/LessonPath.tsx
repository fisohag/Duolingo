import React from 'react';
import { UserProgress } from '../types';

interface LessonPathProps {
  progress: UserProgress;
  onStartLesson: (topic: string, level: number) => void;
  onChangeLanguage: () => void;
}

const TOPICS = [
  { id: 'basics1', title: 'Basics 1', icon: '🥚', level: 1 },
  { id: 'greetings', title: 'Greetings', icon: '👋', level: 1 },
  { id: 'travel', title: 'Travel', icon: '✈️', level: 1 },
  { id: 'food', title: 'Food', icon: '🍎', level: 1 },
  { id: 'family', title: 'Family', icon: '👨‍👩‍👧', level: 1 },
  { id: 'activities', title: 'Activities', icon: '⚽', level: 2 },
  { id: 'people', title: 'People', icon: '👤', level: 2 },
];

export const LessonPath: React.FC<LessonPathProps> = ({ progress, onStartLesson, onChangeLanguage }) => {
  return (
    <div className="pb-24 max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 bg-white border-b-2 border-gray-200 z-10 p-4 flex justify-between items-center">
        <div className="flex items-center">
           <button 
             onClick={onChangeLanguage}
             className="flex items-center space-x-2 px-2 py-1 rounded-xl hover:bg-gray-100 border-2 border-transparent hover:border-gray-200 transition-all group"
           >
             <span className="text-2xl">{progress.currentLanguage?.flag}</span>
             <span className="text-xs font-extrabold text-gray-400 group-hover:text-gray-600 uppercase tracking-wide">Change</span>
           </button>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center text-red-500 font-bold">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {progress.hearts}
          </div>
          <div className="flex items-center text-yellow-500 font-bold">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {progress.xp}
          </div>
        </div>
      </header>

      {/* Path */}
      <div className="pt-8 px-4 flex flex-col items-center space-y-8">
        {TOPICS.map((topic, index) => {
          // Simple zig-zag layout logic
          const offset = index % 2 === 0 ? 'translate-x-0' : (index % 4 === 1 ? 'translate-x-8' : '-translate-x-8');
          const isCompleted = progress.completedLessons.includes(topic.id);
          const isNext = !isCompleted && (index === 0 || progress.completedLessons.includes(TOPICS[index - 1].id));
          const isLocked = !isCompleted && !isNext;

          let btnColorClass = isCompleted ? "bg-[#ffc800] ring-[#e5b400]" : (isNext ? "bg-[#58cc02] ring-[#46a302]" : "bg-[#e5e5e5] ring-[#cecece]");
          
          return (
            <div key={topic.id} className={`transform ${offset} relative group`}>
               {/* Label */}
               <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                   <span className="text-gray-500 font-bold text-sm bg-white px-2 py-1 rounded-md shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                       {topic.title}
                   </span>
               </div>

              <button
                onClick={() => !isLocked && onStartLesson(topic.title, topic.level)}
                disabled={isLocked}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl shadow-lg ring-8 ring-opacity-20 transition-all transform active:scale-95 ${btnColorClass}`}
                style={{
                    boxShadow: !isLocked ? `0 6px 0 0 ${isNext ? '#46a302' : '#e5b400'}` : 'none'
                }}
              >
                {isCompleted ? '👑' : topic.icon}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex justify-around max-w-md mx-auto">
        <button className="flex flex-col items-center text-[#58cc02]">
            <span className="text-2xl">🏠</span>
        </button>
         <button className="flex flex-col items-center text-gray-400">
            <span className="text-2xl">🏆</span>
        </button>
         <button className="flex flex-col items-center text-gray-400">
            <span className="text-2xl">👤</span>
        </button>
      </div>
    </div>
  );
};