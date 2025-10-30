// types/quiz.ts
export type QuestionCategory = 'beginner' | 'easy' | 'medium' | 'hard' | 'advanced';

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: QuestionCategory;
}

export interface QuizConfig {
  role: string;
  duration: number; // in minutes
  questionCount: number;
  customDuration?: number;
  customQuestionCount?: number;
  category?: QuestionCategory;
}

export interface QuizState {
  config: QuizConfig;
  currentQuestion: number;
  answers: number[]; // index of selected answers
  startTime: Date | null;
  endTime: Date | null;
  isCompleted: boolean;
  timeRemaining: number; // in seconds
  score: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export type QuizRole = Role;

export interface AnswerReview {
  question: Question;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  questionNumber: number;
}

export interface IncorrectAnswer {
  question: Question;
  userAnswer: number;
  correctAnswer: number;
  questionNumber: number;
}
