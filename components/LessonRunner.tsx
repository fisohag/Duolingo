import React, { useState, useEffect } from 'react';
import { Lesson, Challenge, ChallengeType } from '../types';
import { Button } from './Button';

interface LessonRunnerProps {
  lesson: Lesson;
  onComplete: (score: number) => void;
  onExit: () => void;
}

export const LessonRunner: React.FC<LessonRunnerProps> = ({ lesson, onComplete, onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'incorrect'>('idle');
  const [hearts, setHearts] = useState(3);

  const currentChallenge: Challenge = lesson.challenges[currentIndex];
  const progressPercent = ((currentIndex) / lesson.challenges.length) * 100;

  useEffect(() => {
    // Reset state when challenge changes
    setSelectedOption(null);
    setStatus('idle');
  }, [currentIndex]);

  const handleCheck = () => {
    if (!selectedOption) return;

    if (selectedOption === currentChallenge.correctAnswer) {
      setStatus('correct');
      const audio = new Audio(`https://api.dictionaryapi.dev/media/pronunciations/en/${selectedOption.toLowerCase()}.mp3`); // Mock audio for effect
      audio.play().catch(() => {}); // Ignore errors if not found
    } else {
      setStatus('incorrect');
      setHearts(h => Math.max(0, h - 1));
    }
  };

  const handleNext = () => {
    if (currentIndex < lesson.challenges.length - 1) {
        if (hearts === 0) {
            onExit(); // Fail
        } else {
            setCurrentIndex(prev => prev + 1);
        }
    } else {
      onComplete(hearts * 10);
    }
  };

  // Fail state
  if (hearts === 0) {
      return (
          <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center p-6 text-center">
              <div className="text-6xl mb-4">💔</div>
              <h2 className="text-2xl font-bold text-gray-700 mb-2">Out of hearts!</h2>
              <p className="text-gray-500 mb-8">You made too many mistakes. Let's try again later.</p>
              <Button onClick={onExit} variant="primary" fullWidth>Quit Lesson</Button>
          </div>
      );
  }

  // Loading image URL
  // Use Picsum with a seed based on the keyword to ensure consistency but uniqueness per keyword
  const imageUrl = currentChallenge.imageKeyword 
    ? `https://picsum.photos/seed/${currentChallenge.imageKeyword}/600/400`
    : `https://picsum.photos/600/400`;

  return (
    <div className="fixed inset-0 bg-white z-40 flex flex-col max-w-md mx-auto">
      {/* Top Bar */}
      <div className="px-4 py-4 flex items-center justify-between">
        <button onClick={onExit} className="text-gray-400 hover:text-gray-600">
           <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>
        <div className="flex-1 mx-4 h-4 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-[#58cc02] transition-all duration-500 ease-out" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="text-red-500 font-bold flex items-center">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-1 fill-current" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            {hearts}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 pb-40">
        <h2 className="text-2xl font-bold text-gray-700 mb-6">
            {currentChallenge.type === ChallengeType.TRANSLATE && "Translate this sentence"}
            {currentChallenge.type === ChallengeType.SELECT && "Select the correct meaning"}
            {currentChallenge.type === ChallengeType.FILL_BLANK && "Fill in the blank"}
        </h2>

        {/* Question + Image */}
        <div className="flex flex-col items-center mb-8">
            {currentChallenge.imageKeyword && (
                 <div className="mb-4 w-40 h-40 rounded-2xl overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img src={imageUrl} alt={currentChallenge.imageKeyword} className="w-full h-full object-cover" />
                 </div>
            )}
            
            {/* Speech Bubble / Question Text */}
            <div className="flex items-center space-x-3 w-full">
                {currentChallenge.type !== ChallengeType.SELECT && (
                   <div className="p-3 bg-white border-2 border-gray-200 rounded-2xl w-full">
                       <p className="text-lg text-gray-700">{currentChallenge.question}</p>
                   </div>
                )}
                {currentChallenge.type === ChallengeType.SELECT && (
                     <p className="text-xl font-bold text-gray-700 text-center w-full">{currentChallenge.question}</p>
                )}
            </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 gap-3">
            {currentChallenge.options.map((option, idx) => {
                const isSelected = selectedOption === option;
                const isCorrect = status !== 'idle' && option === currentChallenge.correctAnswer;
                const isWrong = status === 'incorrect' && isSelected;
                
                let borderClass = "border-gray-200 border-b-4 active:border-b-0";
                let bgClass = "bg-white text-gray-700";
                
                if (isSelected && status === 'idle') {
                    borderClass = "border-[#1cb0f6] border-b-4 bg-blue-50 text-[#1cb0f6]";
                }
                if (isCorrect) {
                     borderClass = "border-[#58cc02] bg-green-50 text-[#58cc02]"; // Highlight correct answer
                } else if (isWrong) {
                     borderClass = "border-[#ff4b4b] bg-red-50 text-[#ff4b4b]";
                }

                return (
                    <button
                        key={idx}
                        disabled={status !== 'idle'}
                        onClick={() => setSelectedOption(option)}
                        className={`w-full p-4 rounded-xl text-lg font-medium border-2 transition-all ${borderClass} ${bgClass}`}
                    >
                        {option}
                    </button>
                )
            })}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 max-w-md mx-auto border-t-2 ${status === 'correct' ? 'bg-[#d7ffb8] border-[#b8f28b]' : (status === 'incorrect' ? 'bg-[#ffdfe0] border-[#ffc1c1]' : 'bg-white border-gray-200')}`}>
         
         {status === 'correct' && (
             <div className="mb-4 flex items-center text-[#58a700] font-bold text-xl">
                 <div className="bg-white rounded-full p-1 mr-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                 </div>
                 Amazing!
             </div>
         )}
         
         {status === 'incorrect' && (
             <div className="mb-4">
                 <div className="flex items-center text-[#ea2b2b] font-bold text-xl mb-1">
                    <div className="bg-white rounded-full p-1 mr-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </div>
                    Correct answer:
                 </div>
                 <div className="text-[#ea2b2b] ml-11">{currentChallenge.correctAnswer}</div>
             </div>
         )}

         <Button 
            fullWidth 
            variant={status === 'incorrect' ? 'danger' : (status === 'correct' ? 'primary' : 'primary')}
            disabled={!selectedOption && status === 'idle'}
            onClick={status === 'idle' ? handleCheck : handleNext}
         >
            {status === 'idle' ? 'CHECK' : 'CONTINUE'}
         </Button>
      </div>
    </div>
  );
};
