'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Question, QuizState } from '../types/quiz';

type IncorrectAnswer = {
  question: Question;
  userAnswer: number;
  correctAnswer: number;
  questionNumber: number;
};

type Props = {
  questions: Question[];
  quizState: QuizState;
  incorrectAnswers: IncorrectAnswer[];
  calculateTimeTaken: () => string;
  calculateTimeSaved: () => string;
  completedBeforeTimeLimit: () => boolean;
  getPerformanceMessage: (score: number, total: number) => string;
  reviewAnswers: () => void;
  resetQuiz: () => void;
  saveChallenge: () => Promise<void>;
  saveLoading?: boolean;
};

export default function QuizResults({
  questions,
  quizState,
  incorrectAnswers,
  calculateTimeTaken,
  calculateTimeSaved,
  completedBeforeTimeLimit,
  getPerformanceMessage,
  reviewAnswers,
  resetQuiz,
  saveChallenge,
  saveLoading = false,
}: Props) {
  return (
    <motion.div key="results" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="text-center py-6 sm:py-8 lg:py-12">
      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }} className="animate-bounce text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6">🎉</motion.div>

      <motion.h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-card-foreground mb-4 sm:mb-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        Quiz Completed!
      </motion.h3>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-4 sm:mb-6">
        <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary">
          {getPerformanceMessage(quizState.score, questions.length)}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-md mx-auto">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.4, type: "spring", stiffness: 100 }} className="bg-primary rounded-lg p-3 sm:p-4 text-primary-foreground">
          <div className="text-xl sm:text-2xl font-bold">{quizState.score}/{questions.length}</div>
          <div className="text-xs sm:text-sm font-bold opacity-90">Score</div>
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: "spring", stiffness: 100 }} className="bg-primary rounded-lg p-3 sm:p-4 text-primary-foreground">
          <div className="text-xl sm:text-2xl font-bold">{((quizState.score / questions.length) * 100).toFixed(1)}%</div>
          <div className="text-xs sm:text-sm font-bold opacity-90">Accuracy</div>
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.6, type: "spring", stiffness: 100 }} className="bg-primary rounded-lg p-3 sm:p-4 text-primary-foreground">
          <div className="text-xl sm:text-2xl font-bold">{calculateTimeTaken()}</div>
          <div className="text-xs sm:text-sm font-bold opacity-90">Time Taken</div>
        </motion.div>

        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.7, type: "spring", stiffness: 100 }} className="bg-primary rounded-lg p-3 sm:p-4 text-primary-foreground">
          <div className="text-xl sm:text-2xl font-bold">{completedBeforeTimeLimit() ? calculateTimeSaved() : '0:00'}</div>
          <div className="text-xs sm:text-sm font-bold opacity-90">Time Saved</div>
        </motion.div>
      </div>

      {incorrectAnswers.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} className="mb-4 sm:mb-6 p-3 sm:p-4 bg-danger/10 rounded-lg border border-danger/20">
          <div className="flex items-center justify-center mb-2">
            <span className="text-danger text-base sm:text-lg font-semibold">
              {incorrectAnswers.length} Incorrect Answer{incorrectAnswers.length !== 1 ? 's' : ''}
            </span>
          </div>
          <p className="text-danger text-xs sm:text-sm mb-2 sm:mb-3">Review your mistakes to improve your knowledge</p>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} className="space-y-2 text-xs sm:text-sm text-foreground-muted mb-6 sm:mb-8">
        {completedBeforeTimeLimit() && <p className="text-primary font-semibold text-lg">⚡ You finished {calculateTimeSaved()} before the time limit!</p>}
        {quizState.timeRemaining <= 0 && !completedBeforeTimeLimit() && <p className="text-warning font-semibold">⏰ Times up! Your quiz was automatically submitted.</p>}
      </motion.div>

      <div className="flex flex-col sm:flex-row gap-5">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={reviewAnswers}
          className="flex-1 bg-secondary text-foreground py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
        >
          Review Answers
        </motion.button>

        <div className="flex-1 flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={saveChallenge}
            disabled={saveLoading}
            className={`flex-1 ${saveLoading ? 'opacity-60 cursor-not-allowed' : 'bg-primary hover:shadow-xl'} text-primary-foreground py-3 rounded-lg font-bold shadow-lg transition-all duration-200 text-sm sm:text-base`}
          >
            {saveLoading ? 'Saving...' : 'Save Challenge'}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={resetQuiz}
            className="flex-1 bg-secondary text-foreground py-3 rounded-lg font-bold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
          >
            Take Another Quiz
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
