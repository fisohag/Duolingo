export interface Language {
  id: string;
  name: string;
  flag: string;
  code: string;
}

export enum ChallengeType {
  SELECT = 'SELECT', // Multiple choice with image context
  TRANSLATE = 'TRANSLATE', // Translate sentence
  FILL_BLANK = 'FILL_BLANK'
}

export interface Challenge {
  id: string;
  type: ChallengeType;
  question: string;
  imageKeyword?: string; // For searching generic images
  options: string[];
  correctAnswer: string;
}

export interface Lesson {
  id: string;
  topic: string;
  description: string;
  challenges: Challenge[];
}

export interface UserProgress {
  hearts: number;
  xp: number;
  completedLessons: string[]; // IDs
  currentLanguage: Language | null;
}

export enum AppState {
  WELCOME = 'WELCOME',
  MAP = 'MAP',
  LESSON_LOADING = 'LESSON_LOADING',
  LESSON_ACTIVE = 'LESSON_ACTIVE',
  LESSON_COMPLETE = 'LESSON_COMPLETE',
  ERROR = 'ERROR'
}
