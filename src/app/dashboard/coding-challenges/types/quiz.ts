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
  duration: number;
  questionCount: number;
  customDuration?: number;
  customQuestionCount?: number;
  category?: QuestionCategory;
}

export interface QuizState {
  config: QuizConfig;
  currentQuestion: number;
  answers: number[];
  startTime: Date | null;
  endTime: Date | null;
  isCompleted: boolean;
  timeRemaining: number;
  score: number;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  questions: Question[];
}

export type QuestionCategory = 'beginner' | 'easy' | 'medium' | 'hard' | 'advanced';

// Export QuizRole as an alias for Role for backward compatibility
<<<<<<< HEAD
export type QuizRole = Role;
=======
export type QuizRole = Role;
>>>>>>> a18869bad1544d343318ec043a669992f13a43ba
