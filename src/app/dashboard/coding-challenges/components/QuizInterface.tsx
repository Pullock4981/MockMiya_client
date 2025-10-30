'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Question, QuizState, Role } from '../types/quiz';


type Props = {
  questions: Question[];
  quizState: QuizState;
  handleAnswerSelect: (idx: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  formatTime: (s: number) => string;
  getProgressPercentage: () => number;
  selectedRole?: Role | undefined;
};

export default function QuizInterface({
  questions,
  quizState,
  handleAnswerSelect,
  nextQuestion,
  prevQuestion,
  formatTime,
  getProgressPercentage,
  selectedRole,
}: Props) {
  const current = questions[quizState.currentQuestion];

  return (
    <motion.div key="quiz-active" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4 sm:space-y-6">
      <motion.div className="bg-primary rounded-lg p-4 sm:p-6 text-primary-foreground" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <div>
            <h3 className="font-bold text-lg sm:text-xl">{selectedRole?.name}</h3>
            <p className="text-primary-foreground/80 text-sm">Question {quizState.currentQuestion + 1} of {questions.length}</p>
          </div>
          <div className="text-right">
            <p className="text-primary-foreground/80 text-sm">Time Remaining</p>
            <p className={`text-xl sm:text-2xl font-bold ${quizState.timeRemaining < 60 ? 'text-warning animate-pulse' : 'text-primary-foreground'}`}>
              {formatTime(quizState.timeRemaining)}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="w-full bg-background rounded-full h-2">
        <motion.div className="bg-primary h-2 rounded-full shadow-inner" initial={{ width: "0%" }} animate={{ width: `${getProgressPercentage()}%` }} transition={{ duration: 0.5, ease: "easeOut" }} />
      </div>

      <motion.div key={quizState.currentQuestion} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -50, opacity: 0 }} transition={{ type: "spring", stiffness: 300 }} className="space-y-4 sm:space-y-6">
        <div className="bg-card rounded-lg p-4 sm:p-6 shadow-lg border border-border">
          <h3 className="text-lg sm:text-xl font-semibold text-card-foreground leading-relaxed">{current?.question}</h3>
          <div className="flex gap-2 mt-3">
            <span className="inline-block px-2 sm:px-3 py-1 bg-primary/20 text-primary text-xs sm:text-sm rounded-full font-medium">
              {current?.category?.charAt(0).toUpperCase() + current?.category?.slice(1)}
            </span>
          </div>
        </div>

        <div className="grid gap-2 sm:gap-3">
          {current?.options.map((option, index) => {
            const isSelected = quizState.answers[quizState.currentQuestion] === index;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAnswerSelect(index)}
                disabled={quizState.isCompleted}
                className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 ${isSelected ? 'border-primary bg-primary/10 shadow-md' : 'border-border bg-background hover:border-primary/50 hover:bg-primary/5'}`}
              >
                <div className="flex items-center">
                  <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 font-semibold text-sm sm:text-base ${isSelected ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground-muted'}`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="flex-1 text-foreground text-sm sm:text-base">{option}</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      <motion.div className="flex justify-between pt-4" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={prevQuestion} disabled={quizState.currentQuestion === 0} className="bg-secondary text-foreground py-2 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base">
          Previous
        </motion.button>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={nextQuestion} className="bg-primary text-primary-foreground py-2 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
          {quizState.currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
