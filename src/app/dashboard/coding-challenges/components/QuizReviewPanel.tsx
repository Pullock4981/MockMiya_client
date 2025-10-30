'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Question } from '../types/quiz';

type AnswerReview = {
  question: Question; 
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  questionNumber: number;
};

type Props = {
  allAnswers: AnswerReview[];
  goBack: () => void;
};

export default function QuizReviewPanel({ allAnswers, goBack }: Props) {
  return (
    <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold text-card-foreground mb-2">Quiz Review</h3>
        <p className="text-foreground-muted text-sm sm:text-base">Review your answers and explanations</p>
      </div>

      <div className="flex border-b border-border">
        <button className={`flex-1 py-3 font-semibold border-b-2 text-sm sm:text-base border-primary text-primary`}>All Questions ({allAnswers.length})</button>
      </div>

      <div className="space-y-4 max-h-[705px] overflow-y-auto">
        {allAnswers.map((item, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} className={`p-3 sm:p-4 rounded-lg border-2 ${item.isCorrect ? 'border-success/20 bg-success/10' : 'border-danger/20 bg-danger/10'}`}>
            <div className="flex items-start justify-between mb-2 sm:mb-3">
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <span className="font-semibold text-foreground text-sm sm:text-base">Question {item.questionNumber}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.isCorrect ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                  {item.isCorrect ? 'Correct' : 'Incorrect'}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary">
                  {item.question.category?.charAt(0).toUpperCase() + item.question.category?.slice(1)}
                </span>
              </div>
            </div>

            <h4 className="font-semibold text-foreground text-sm sm:text-base mb-2 sm:mb-3">{item.question.question}</h4>

            <div className="mb-2">
              <span className="text-xs sm:text-sm font-medium text-foreground-secondary">Your Answer:</span>
              <div className={`p-2 sm:p-3 rounded-lg mt-1 ${item.isCorrect ? 'bg-success/20 border border-success/30' : 'bg-danger/20 border border-danger/30'}`}>
                <span className={`font-medium text-sm sm:text-base ${item.isCorrect ? 'text-success' : 'text-danger'}`}>
                  {String.fromCharCode(65 + item.userAnswer)}. {item.question.options[item.userAnswer]}
                </span>
                {!item.isCorrect && <span className="ml-2 text-danger">❌</span>}
              </div>
            </div>

            {!item.isCorrect && (
              <div className="mb-2 sm:mb-3">
                <span className="text-xs sm:text-sm font-medium text-foreground-secondary">Correct Answer:</span>
                <div className="p-2 sm:p-3 rounded-lg mt-1 bg-success/20 border border-success/30">
                  <span className="font-medium text-success text-sm sm:text-base">
                    {String.fromCharCode(65 + item.correctAnswer)}. {item.question.options[item.correctAnswer]}
                  </span>
                  <span className="ml-2 text-success">✅</span>
                </div>
              </div>
            )}

            {item.question.explanation && (
              <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-primary/10 rounded-lg border border-primary/20">
                <span className="text-xs sm:text-sm font-medium text-primary">Explanation:</span>
                <p className="text-foreground mt-1 text-xs sm:text-sm">{item.question.explanation}</p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={goBack} className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base">
        Back to Results
      </motion.button>
    </motion.div>
  );
}
