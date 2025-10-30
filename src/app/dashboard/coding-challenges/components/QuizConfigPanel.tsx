// src/app/dashboard/coding-challenges/components/QuizConfigPanel.tsx
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QuestionCategory, QuizConfig, QuizState, Role } from '../types/quiz';

type CategoryItem = {
  id: string;
  name: string;
  description: string;
};

type Props = {
  config: QuizConfig;
  setConfig: (c: QuizConfig) => void;
  isCustomizing: boolean;
  setIsCustomizing: (v: boolean) => void;
  isLoading: boolean;
  startQuiz: () => void;
  resetQuiz: () => void;
  quizState: QuizState | null; // <- use the shared QuizState type
  quizRoles: Role[];
  defaultQuizConfigs: { label: string; duration: number; questionCount: number }[];
  questionCategories: CategoryItem[]; // <-- expect data shape
  selectedRole?: Role;
  selectedCategory?: CategoryItem | undefined; // <-- data shape for selected
};

export default function QuizConfigPanel({
  config,
  setConfig,
  isCustomizing,
  setIsCustomizing,
  isLoading,
  startQuiz,
  resetQuiz,
  quizState,
  quizRoles,
  defaultQuizConfigs,
  questionCategories,
  selectedRole,
  selectedCategory,
}: Props) {
  // helper to show category info (safe)
  const selectedCategoryFromConfig = questionCategories.find(c => c.id === String(config.category));

  return (
    <motion.div
      key="left-panel"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="border-border bg-card shadow-lg rounded-xl sm:rounded-2xl p-4"
    >
      <motion.h2
        className="text-xl sm:text-2xl font-bold text-card-foreground mb-4 sm:mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Quiz Configuration
      </motion.h2>

      <div className="space-y-4 sm:space-y-6">
        {/* Role Selection */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <label className="block text-xs sm:text-sm font-semibold text-foreground-secondary">Select Your Role</label>
          <div className="relative">
            <select
              value={config.role}
              onChange={(e) => setConfig({ ...config, role: e.target.value })}
              className="w-full p-3 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground text-sm sm:text-base appearance-none cursor-pointer"
              disabled={!!quizState}
            >
              <option value="">Choose a professional role</option>
              {quizRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted">▼</div>
          </div>

          {selectedRole && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs sm:text-sm font-semibold text-foreground bg-primary/10 p-3 rounded-lg border border-primary/20 mt-2">
              {selectedRole.description}
            </motion.p>
          )}
        </motion.div>

        {/* Category Selection */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
          <label className="block text-xs sm:text-sm font-semibold text-foreground-secondary">Questions Category</label>
          <div className="relative">
            <select
              value={config.category ?? ''}
              onChange={(e) =>
                setConfig({
                  ...config,
                  category: e.target.value ? (e.target.value as QuestionCategory) : undefined,
                })
              }
              className="w-full p-3 border border-border bg-background rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-foreground text-sm sm:text-base appearance-none cursor-pointer"
              disabled={!!quizState}
            >
              <option value="">All Levels (Mixed Difficulty)</option>
              {questionCategories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name} - {category.description}
                </option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground-muted">▼</div>
          </div>

          {/* show selected via passed selectedCategory OR by matching config */}
          {(selectedCategory || selectedCategoryFromConfig) && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-semibold sm:text-sm text-foreground bg-primary/10 p-3 rounded-lg border border-primary/20 mt-2">
              <span className="font-semibold text-foreground">{(selectedCategory?.name ?? selectedCategoryFromConfig?.name)}:</span>{' '}
              {(selectedCategory?.description ?? selectedCategoryFromConfig?.description)}
            </motion.p>
          )}

          {!config.category && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs sm:text-sm border-primary bg-primary/10 p-3 rounded-lg border mt-2">
              💡 Questions will be selected from all difficulty levels. Choose a specific category to focus on a particular difficulty.
            </motion.p>
          )}
        </motion.div>

        {/* Timer & Questions Setting */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}>
          <label className="block text-xs sm:text-sm font-semibold text-foreground-secondary">Quiz Settings</label>
          <div className="grid gap-2 sm:gap-3">
            {defaultQuizConfigs.map((configOption, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  setConfig({
                    ...config,
                    duration: configOption.duration,
                    questionCount: configOption.questionCount,
                  });
                  setIsCustomizing(false);
                }}
                className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                  config.duration === configOption.duration && !isCustomizing
                    ? 'border-primary bg-primary/10 shadow-md'
                    : 'border-border bg-background hover:border-primary/50'
                }`}
                disabled={!!quizState}
              >
                <div className="font-semibold text-foreground text-sm sm:text-base">{configOption.label}</div>
              </motion.button>
            ))}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsCustomizing(true)}
              className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                isCustomizing ? 'border-primary bg-primary/10 shadow-md' : 'border-border bg-background hover:border-primary/50'
              }`}
              disabled={!!quizState}
            >
              <div className="font-semibold text-foreground text-sm sm:text-base">Custom Configuration</div>
            </motion.button>
          </div>

          <AnimatePresence>
            {isCustomizing && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden mt-3">
                <div className="p-3 sm:p-4 bg-background-secondary rounded-lg border border-border space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-foreground-secondary mb-2">Duration (minutes)</label>
                    <input
                      type="range"
                      min={1}
                      max={60}
                      value={config.duration}
                      onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value, 10) })}
                      className="w-full h-2 bg-primary rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs sm:text-sm text-foreground-muted mt-1">
                      <span>1 min</span>
                      <span className="font-semibold text-primary">{config.duration} min</span>
                      <span>60 min</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-semibold text-foreground-secondary mb-2">Number of Questions</label>
                    <input
                      type="range"
                      min={1}
                      max={30}
                      value={config.questionCount}
                      onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value, 10) })}
                      className="w-full h-2 bg-background rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs sm:text-sm text-foreground-muted mt-1">
                      <span>1 question</span>
                      <span className="font-semibold text-primary">{config.questionCount} questions</span>
                      <span>30 questions</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Selected Summary */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="border-primary bg-primary/10 border rounded-lg p-4 sm:p-5">
          <h3 className="font-bold text-lg mb-3">Ready to Start</h3>
          <div className="space-y-2 text-xs sm:text-sm">
            <div className="flex justify-between">
              <span>Role:</span>
              <span className="font-semibold">{selectedRole?.name || 'Not selected'}</span>
            </div>
            <div className="flex justify-between">
              <span>Category:</span>
              <span className="font-semibold">{selectedCategory?.name ?? selectedCategoryFromConfig?.name ?? 'All Levels'}</span>
            </div>
            <div className="flex justify-between">
              <span>Duration:</span>
              <span className="font-semibold">{config.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span>Questions:</span>
              <span className="font-semibold">{config.questionCount}</span>
            </div>
          </div>
        </motion.div>

        {/* Actions */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }} className="flex gap-3">
          <motion.button
            onClick={startQuiz}
            disabled={!!quizState || !config.role || isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-primary text-primary-foreground py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
          >
            {isLoading ? (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-primary-foreground border-t-transparent rounded-full mr-2"
                />
                Preparing Quiz...
              </>
            ) : (
              'Start Quiz'
            )}
          </motion.button>

          <motion.button
            onClick={resetQuiz}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-secondary text-foreground py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
          >
            Reset
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
