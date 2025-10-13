// export interface Question {
//   id: string;
//   question: string;
//   options: string[];
//   correctAnswer: number;
//   explanation?: string;
// }

// export interface QuizConfig {
//   role: string;
//   duration: number;
//   questionCount: number;
//   customDuration?: number;
//   customQuestionCount?: number;
// }

// export interface QuizState {
//   currentQuestion: number;
//   answers: number[];
//   timeLeft: number;
//   isCompleted: boolean;
//   isStarted: boolean;
// }

// export interface Role {
//   id: string;
//   name: string;
//   description: string;
// }

// export interface QuizState {
//   config: QuizConfig;
//   currentQuestion: number;
//   answers: number[];
//   startTime: Date | null;
//   endTime: Date | null;
//   isCompleted: boolean;
//   timeRemaining: number;
// }





// quiz.ts
export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
  category: QuestionCategory; // Add this
}

export interface QuizConfig {
  role: string;
  duration: number;
  questionCount: number;
  customDuration?: number;
  customQuestionCount?: number;
  category?: QuestionCategory; // Add this
}

export interface QuizState {
  currentQuestion: number;
  answers: number[];
  timeLeft: number;
  isCompleted: boolean;
  isStarted: boolean;
}

export interface Role {
  id: string;
  name: string;
  description: string;
  questions: Question[]; // Add this to Role interface
}

export interface QuizState {
  config: QuizConfig;
  currentQuestion: number;
  answers: number[];
  startTime: Date | null;
  endTime: Date | null;
  isCompleted: boolean;
  timeRemaining: number;
  score: number; // Add this if missing
}

// Add this new type
export type QuestionCategory = 'beginner' | 'easy' | 'medium' | 'hard' | 'advanced';