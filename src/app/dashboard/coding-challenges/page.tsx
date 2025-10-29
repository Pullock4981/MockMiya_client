'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizConfig, QuizState, Question, QuestionCategory, Role } from '../../dashboard/coding-challenges/types/quiz';
import { quizRoles, defaultQuizConfigs, questionCategories } from '../../dashboard/coding-challenges/data/quizData';

interface IncorrectAnswer {
  question: Question;
  userAnswer: number;
  correctAnswer: number;
  questionNumber: number;
}

interface AnswerReview {
  question: Question;
  userAnswer: number;
  correctAnswer: number;
  isCorrect: boolean;
  questionNumber: number;
}

export default function CodingChallenges() {
  const pathname = usePathname();
  const [config, setConfig] = useState<QuizConfig>({
    role: '',
    duration: 5,
    questionCount: 10,
  });
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  const selectedRole = quizRoles.find(role => role.id === config.role);
  const selectedCategory = questionCategories.find(cat => cat.id === config.category);

  // Calculate progress percentage
  const getProgressPercentage = () => {
    if (!quizState || questions.length === 0) return 0;
    return ((quizState.currentQuestion + 1) / questions.length) * 100;
  };

  const generateRandomQuestions = useCallback((roleId: string, count: number, category?: QuestionCategory): Question[] => {
    const role = quizRoles.find(r => r.id === roleId);
    if (!role) return [];
    
    // Filter questions by category if specified
    let filteredQuestions = role.questions;
    if (category) {
      filteredQuestions = role.questions.filter(q => q.category === category);
    }
    
    // If no questions found for the selected category, show a message and return all questions
    if (filteredQuestions.length === 0) {
      filteredQuestions = role.questions;
    }
    
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, filteredQuestions.length));
  }, []);

  const startQuiz = async () => {
    if (!config.role) {
      alert('Please select a role');
      return;
    }

    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const generatedQuestions = generateRandomQuestions(config.role, config.questionCount, config.category);
    if (generatedQuestions.length === 0) {
      alert('No questions available for this role and category combination');
      setIsLoading(false);
      return;
    }

    setQuestions(generatedQuestions);
    setQuizState({
      config: { ...config },
      currentQuestion: 0,
      answers: new Array(generatedQuestions.length).fill(-1),
      startTime: new Date(),
      endTime: null,
      isCompleted: false,
      timeRemaining: config.duration * 60,
      score: 0,
    });
    setShowReview(false);
    setShowLeftPanel(false);
    setIsLoading(false);
  };

  const resetQuiz = () => {
    setQuizState(null);
    setQuestions([]);
    setShowReview(false);
    setShowLeftPanel(true);
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (!quizState || quizState.isCompleted) return;

    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentQuestion] = answerIndex;
    
    setQuizState({
      ...quizState,
      answers: newAnswers,
    });
  };

  const nextQuestion = () => {
    if (!quizState) return;
    
    if (quizState.currentQuestion < questions.length - 1) {
      setQuizState({
        ...quizState,
        currentQuestion: quizState.currentQuestion + 1,
      });
    } else {
      const score = calculateScore();
      setQuizState({
        ...quizState,
        isCompleted: true,
        endTime: new Date(),
        score,
      });
      setShowLeftPanel(true);
    }
  };

  const prevQuestion = () => {
    if (!quizState || quizState.currentQuestion === 0) return;
    
    setQuizState({
      ...quizState,
      currentQuestion: quizState.currentQuestion - 1,
    });
  };

  // Timer effect
  useEffect(() => {
    if (!quizState || quizState.isCompleted || quizState.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setQuizState(prev => {
        if (!prev || prev.timeRemaining <= 0) return prev;
        
        if (prev.timeRemaining === 1) {
          const score = calculateScore();
          setShowLeftPanel(true);
          return { 
            ...prev, 
            timeRemaining: 0, 
            isCompleted: true,
            endTime: new Date(),
            score,
          };
        }
        
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quizState]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = (): number => {
    if (!quizState) return 0;
    
    return quizState.answers.reduce((score, answer, index) => {
      return answer === questions[index]?.correctAnswer ? score + 1 : score;
    }, 0);
  };

  const calculateTimeTaken = (): string => {
    if (!quizState || !quizState.startTime) return '0:00';
    
    const endTime = quizState.endTime || new Date();
    const timeDiff = endTime.getTime() - quizState.startTime.getTime();
    
    const totalSeconds = Math.floor(timeDiff / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const calculateTimeSaved = (): string => {
    if (!quizState || !quizState.startTime) return '0:00';
    
    const totalAllowedSeconds = quizState.config.duration * 60;
    const endTime = quizState.endTime || new Date();
    const timeTakenSeconds = Math.floor((endTime.getTime() - quizState.startTime.getTime()) / 1000);
    
    const timeSavedSeconds = totalAllowedSeconds - timeTakenSeconds;
    
    if (timeSavedSeconds <= 0) return '0:00';
    
    const minutes = Math.floor(timeSavedSeconds / 60);
    const seconds = timeSavedSeconds % 60;
    
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const completedBeforeTimeLimit = (): boolean => {
    if (!quizState || !quizState.startTime || !quizState.endTime) return false;
    
    const totalAllowedSeconds = quizState.config.duration * 60;
    const timeTakenSeconds = Math.floor((quizState.endTime.getTime() - quizState.startTime.getTime()) / 1000);
    
    return timeTakenSeconds < totalAllowedSeconds;
  };

  const getPerformanceMessage = (score: number, total: number): string => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'Outstanding! 🎯';
    if (percentage >= 80) return 'Excellent! 🌟';
    if (percentage >= 70) return 'Great Job! 👍';
    if (percentage >= 60) return 'Good Work! 💪';
    return 'Keep Practicing! 📚';
  };

  // Get incorrect answers for review
  const getIncorrectAnswers = (): IncorrectAnswer[] => {
    if (!quizState) return [];
    
    return questions.map((question, index) => {
      const userAnswer = quizState.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (!isCorrect) {
        return {
          question,
          userAnswer,
          correctAnswer: question.correctAnswer,
          questionNumber: index + 1
        };
      }
      return null;
    }).filter((item): item is IncorrectAnswer => item !== null);
  };

  // Get all answers for full review
  const getAllAnswers = (): AnswerReview[] => {
    if (!quizState) return [];
    
    return questions.map((question, index) => {
      const userAnswer = quizState.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      return {
        question,
        userAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        questionNumber: index + 1
      };
    });
  };

  const incorrectAnswers = getIncorrectAnswers();
  const allAnswers = getAllAnswers();

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-6 sm:mb-8 lg:mb-12 text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl">📝</div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--card-foreground)]">
              Quizing Challenges
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto px-4">
            Test your skills with role-based assessments
          </p>
        </motion.div>

        <div className={`grid gap-4 sm:gap-6 lg:gap-8 ${
          showLeftPanel ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}>
          {/* Left Side - Configuration */}
          <AnimatePresence>
            {showLeftPanel && (
              <motion.div
                key="left-panel"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0, transition: { duration: 0.2 } }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="border-[var(--border)] bg-[var(--card)] shadow-lg rounded-xl sm:rounded-2xl p-4"
              >
                <motion.h2 
                  className="text-xl sm:text-2xl font-bold text-[var(--card-foreground)] mb-4 sm:mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Quiz Configuration
                </motion.h2>
                
                <div className="space-y-4 sm:space-y-6">
                  {/* Role Selection */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.1 }}
                    className="space-y-2 sm:space-y-3"
                  >
                    <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)]">
                      Select Your Role
                    </label>
                    <div className="relative">
                      <select
                        value={config.role}
                        onChange={(e) => setConfig({ ...config, role: e.target.value })}
                        className="w-full p-3 border border-[var(--border)] bg-[var(--background)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] text-sm sm:text-base appearance-none cursor-pointer"
                        disabled={!!quizState}
                      >
                        <option value="">Choose a professional role</option>
                        {quizRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground-muted)]">
                        ▼
                      </div>
                    </div>
                    {selectedRole && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs sm:text-sm font-semibold text-[var(--foreground)] bg-[var(--primary)]/10 p-3 rounded-lg border border-[var(--primary)]/20"
                      >
                        {selectedRole.description}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Question Category Selection */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
                    className="space-y-2 sm:space-y-3"
                  >
                    <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)]">
                      Questions Category
                    </label>
                    <div className="relative">
                      <select
                        value={config.category || ''}
                        onChange={(e) => setConfig({ 
                          ...config, 
                          category: e.target.value ? e.target.value as QuestionCategory : undefined 
                        })}
                        className="w-full p-3 border border-[var(--border)] bg-[var(--background)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] text-sm sm:text-base appearance-none cursor-pointer"
                        disabled={!!quizState}
                      >
                        <option value="">All Levels (Mixed Difficulty)</option>
                        {questionCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name} - {category.description}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--foreground-muted)]">
                        ▼
                      </div>
                    </div>
                    {selectedCategory && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-semibold sm:text-sm text-[var(--foreground)] bg-[var(--primary)]/10 p-3 rounded-lg border border-[var(--primary)]/20"
                      >
                        <span className="font-semibold text-[var(--foreground)]">{selectedCategory.name}:</span> {selectedCategory.description}
                      </motion.p>
                    )}
                    {!config.category && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs sm:text-sm border-[var(--primary)] bg-[var(--primary)]/10 p-3 rounded-lg border"
                      >
                        💡 Questions will be selected from all difficulty levels. Choose a specific category to focus on a particular difficulty.
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Timer and Questions Selection */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
                    className="space-y-2 sm:space-y-3"
                  >
                    <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)]">
                      Quiz Settings
                    </label>
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
                              ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-md'
                              : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50'
                          }`}
                          disabled={!!quizState}
                        >
                          <div className="font-semibold text-[var(--foreground)] text-sm sm:text-base">{configOption.label}</div>
                        </motion.button>
                      ))}
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsCustomizing(true)}
                        className={`p-3 sm:p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                          isCustomizing
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-md'
                            : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50'
                        }`}
                        disabled={!!quizState}
                      >
                        <div className="font-semibold text-[var(--foreground)] text-sm sm:text-base">Custom Configuration</div>
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {isCustomizing && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-3 p-3 sm:p-4 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] space-y-3 sm:space-y-4">
                            <div>
                              <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] mb-2">
                                Duration (minutes)
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="60"
                                value={config.duration}
                                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
                                className="w-full h-2 bg-[var(--background-tertiary)] rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                                <span>1 min</span>
                                <span className="font-semibold text-[var(--primary)]">{config.duration} min</span>
                                <span>60 min</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] mb-2">
                                Number of Questions
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="30"
                                value={config.questionCount}
                                onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                                className="w-full h-2 bg-[var(--background-tertiary)] rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-xs sm:text-sm text-[var(--foreground-muted)] mt-1">
                                <span>1 question</span>
                                <span className="font-semibold text-[var(--primary)]">{config.questionCount} questions</span>
                                <span>30 questions</span>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Selected Configuration Summary */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.4 }}
                    className="border-[var(--primary)] bg-[var(--primary)]/10 border rounded-lg p-4 sm:p-5"
                  >
                    <h3 className="font-bold text-lg mb-3">Ready to Start</h3>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex justify-between">
                        <span>Role:</span>
                        <span className="font-semibold">{selectedRole?.name || 'Not selected'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Category:</span>
                        <span className="font-semibold">
                          {config.category 
                            ? questionCategories.find(c => c.id === config.category)?.name 
                            : 'All Levels'
                          }
                        </span>
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

                  {/* Action Buttons */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: 0.5 }}
                    className="flex gap-3"
                  >
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startQuiz}
                      disabled={!!quizState || !config.role || isLoading}
                      className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center text-sm sm:text-base"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-[var(--primary-foreground)] hover:shadow-lg border-t-transparent rounded-full mr-2"
                          />
                          Preparing Quiz...
                        </>
                      ) : (
                        'Start Quiz'
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={resetQuiz}
                      className="flex-1 bg-[var(--secondary)] text-[var(--foreground)] py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                    >
                      Reset
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Side - Quiz Interface */}
          <motion.div
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={`border-[var(--border)] bg-[var(--card)] shadow-lg rounded-xl sm:rounded-2xl p-4 ${
              !showLeftPanel ? 'lg:col-span-2' : ''
            }`}
          >
            <motion.h2 
              className="text-xl sm:text-2xl font-bold text-[var(--card-foreground)] mb-4 sm:mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {quizState && !quizState.isCompleted ? 'Quiz in Progress' : 'Quiz Session'}
            </motion.h2>
            
            <AnimatePresence mode="wait">
              {!quizState ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-8 sm:py-12 lg:py-16"
                >
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6"
                  >
                    📝
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--card-foreground)] mb-2 sm:mb-3">
                    Ready to Challenge Yourself?
                  </h3>
                  <p className="text-[var(--foreground-muted)] text-sm sm:text-base lg:text-lg max-w-md mx-auto px-4">
                    Configure your quiz settings on the left and click Start Quiz to begin your assessment.
                  </p>
                </motion.div>
              ) : quizState.isCompleted || quizState.timeRemaining <= 0 ? (
                showReview ? (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    {/* Review Header */}
                    <div className="text-center">
                      <h3 className="text-xl sm:text-2xl font-bold text-[var(--card-foreground)] mb-2">Quiz Review</h3>
                      <p className="text-[var(--foreground-muted)] text-sm sm:text-base">Review your answers and explanations</p>
                    </div>

                    {/* Review Tabs */}
                    <div className="flex border-b border-[var(--border)]">
                      <button
                        onClick={() => setShowReview(true)}
                        className={`flex-1 py-3 font-semibold border-b-2 text-sm sm:text-base ${
                          showReview 
                            ? 'border-[var(--primary)] text-[var(--primary)]' 
                            : 'border-transparent text-[var(--foreground-muted)]'
                        }`}
                      >
                        All Questions ({allAnswers.length})
                      </button>
                    </div>

                    {/* Questions Review */}
                    <div className="space-y-4 max-h-[705px] overflow-y-auto">
                      {allAnswers.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-3 sm:p-4 rounded-lg border-2 ${
                            item.isCorrect 
                              ? 'border-[var(--success)]/20 bg-[var(--success)]/10' 
                              : 'border-[var(--destructive)]/20 bg-[var(--destructive)]/10'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2 sm:mb-3">
                            <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                              <span className="font-semibold text-[var(--foreground)] text-sm sm:text-base">
                                Question {item.questionNumber}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.isCorrect 
                                  ? 'bg-[var(--success)]/20 text-[var(--success)]' 
                                  : 'bg-[var(--destructive)]/20 text-[var(--destructive)]'
                              }`}>
                                {item.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-[var(--primary)]/20 text-[var(--primary)]">
                                {item.question.category?.charAt(0).toUpperCase() + item.question.category?.slice(1)}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-semibold text-[var(--foreground)] text-sm sm:text-base mb-2 sm:mb-3">
                            {item.question.question}
                          </h4>

                          {/* User Answer */}
                          <div className="mb-2">
                            <span className="text-xs sm:text-sm font-medium text-[var(--foreground-secondary)]">Your Answer:</span>
                            <div className={`p-2 sm:p-3 rounded-lg mt-1 ${
                              item.isCorrect 
                                ? 'bg-[var(--success)]/20 border border-[var(--success)]/30' 
                                : 'bg-[var(--destructive)]/20 border border-[var(--destructive)]/30'
                            }`}>
                              <span className={`font-medium text-sm sm:text-base ${
                                item.isCorrect ? 'text-[var(--success)]' : 'text-[var(--destructive)]'
                              }`}>
                                {String.fromCharCode(65 + item.userAnswer)}. {item.question.options[item.userAnswer]}
                              </span>
                              {!item.isCorrect && (
                                <span className="ml-2 text-[var(--destructive)]">❌</span>
                              )}
                            </div>
                          </div>

                          {/* Correct Answer */}
                          {!item.isCorrect && (
                            <div className="mb-2 sm:mb-3">
                              <span className="text-xs sm:text-sm font-medium text-[var(--foreground-secondary)]">Correct Answer:</span>
                              <div className="p-2 sm:p-3 rounded-lg mt-1 bg-[var(--success)]/20 border border-[var(--success)]/30">
                                <span className="font-medium text-[var(--success)] text-sm sm:text-base">
                                  {String.fromCharCode(65 + item.correctAnswer)}. {item.question.options[item.correctAnswer]}
                                </span>
                                <span className="ml-2 text-[var(--success)]">✅</span>
                              </div>
                            </div>
                          )}

                          {/* Explanation */}
                          {item.question.explanation && (
                            <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-[var(--primary)]/10 rounded-lg border border-[var(--primary)]/20">
                              <span className="text-xs sm:text-sm font-medium text-[var(--primary)]">Explanation:</span>
                              <p className="text-[var(--foreground)] mt-1 text-xs sm:text-sm">{item.question.explanation}</p>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>

                    {/* Back to Results Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowReview(false)}
                      className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    >
                      Back to Results
                    </motion.button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-6 sm:py-8 lg:py-12"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="animate-bounce text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6"
                    >
                      🎉
                    </motion.div>
                    
                    <motion.h3 
                      className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--card-foreground)] mb-4 sm:mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      Quiz Completed!
                    </motion.h3>

                    {/* Performance Message */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mb-4 sm:mb-6"
                    >
                      <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-[var(--primary)]">
                        {getPerformanceMessage(quizState.score, questions.length)}
                      </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-md mx-auto">
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                        className="bg-[var(--primary)] rounded-lg p-3 sm:p-4 text-[var(--primary-foreground)]"
                      >
                        <div className="text-xl sm:text-2xl font-bold">{quizState.score}/{questions.length}</div>
                        <div className="text-xs sm:text-sm font-bold opacity-90">Score</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
                        className="bg-[var(--primary)] rounded-lg p-3 sm:p-4 text-[var(--primary-foreground)]"
                      >
                        <div className="text-xl sm:text-2xl font-bold">{((quizState.score / questions.length) * 100).toFixed(1)}%</div>
                        <div className="text-xs sm:text-sm font-bold opacity-90">Accuracy</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 100 }}
                        className="bg-[var(--primary)] rounded-lg p-3 sm:p-4 text-[var(--primary-foreground)]"
                      >
                        <div className="text-xl sm:text-2xl font-bold">{calculateTimeTaken()}</div>
                        <div className="text-xs sm:text-sm font-bold opacity-90">Time Taken</div>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.7, type: "spring", stiffness: 100 }}
                        className="bg-[var(--primary)] rounded-lg p-3 sm:p-4 text-[var(--primary-foreground)]"
                      >
                        <div className="text-xl sm:text-2xl font-bold">
                          {completedBeforeTimeLimit() ? calculateTimeSaved() : '0:00'}
                        </div>
                        <div className="text-xs sm:text-sm font-bold opacity-90">Time Saved</div>
                      </motion.div>
                    </div>

                    {/* Incorrect Answers Summary */}
                    {incorrectAnswers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="mb-4 sm:mb-6 p-3 sm:p-4 bg-[var(--destructive)]/10 rounded-lg border border-[var(--destructive)]/20"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-[var(--destructive)] text-base sm:text-lg font-semibold">
                            {incorrectAnswers.length} Incorrect Answer{incorrectAnswers.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-[var(--destructive)] text-xs sm:text-sm mb-2 sm:mb-3">
                          Review your mistakes to improve your knowledge
                        </p>
                      </motion.div>
                    )}

                    {/* Additional Info */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9 }}
                      className="space-y-2 text-xs sm:text-sm text-[var(--foreground-muted)] mb-6 sm:mb-8"
                    >
                      {completedBeforeTimeLimit() && (
                        <p className="text-[var(--primary)] font-semibold text-lg">
                          ⚡ You finished {calculateTimeSaved()} before the time limit!
                        </p>
                      )}
                      {quizState.timeRemaining <= 0 && !completedBeforeTimeLimit() && (
                        <p className="text-[var(--warning)] font-semibold">
                          ⏰ Times up! Your quiz was automatically submitted.
                        </p>
                      )}
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowReview(true)}
                        className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] py-3 rounded-lg font-bold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                      >
                        Review Answers
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetQuiz}
                        className="flex-1 bg-[var(--secondary)] text-[var(--foreground)] py-3 sm:py-4 px-4 sm:px-6 rounded-lg font-bold hover:shadow-lg transition-all duration-200 text-sm sm:text-base"
                      >
                        Take Another Quiz
                      </motion.button>
                    </div>
                  </motion.div>
                )
              ) : (
                <motion.div
                  key="quiz-active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 sm:space-y-6"
                >
                  {/* Quiz Header */}
                  <motion.div 
                    className="bg-[var(--primary)] rounded-lg p-4 sm:p-6 text-[var(--primary-foreground)]"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
                      <div>
                        <h3 className="font-bold text-lg sm:text-xl">{selectedRole?.name}</h3>
                        <p className="text-[var(--primary-foreground)]/80 text-sm">
                          Question {quizState.currentQuestion + 1} of {questions.length}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[var(--primary-foreground)]/80 text-sm">Time Remaining</p>
                        <p className={`text-xl sm:text-2xl font-bold ${
                          quizState.timeRemaining < 60 ? 'text-[var(--warning)] animate-pulse' : 'text-[var(--primary-foreground)]'
                        }`}>
                          {formatTime(quizState.timeRemaining)}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[var(--background-tertiary)] rounded-full h-2">
                    <motion.div
                      className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] h-2 rounded-full shadow-inner"
                      initial={{ width: "0%" }}
                      animate={{ width: `${getProgressPercentage()}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                    />
                  </div>

                  {/* Current Question */}
                  <motion.div
                    key={quizState.currentQuestion}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="bg-[var(--card)] rounded-lg p-4 sm:p-6 shadow-lg border border-[var(--border)]">
                      <h3 className="text-lg sm:text-xl font-semibold text-[var(--card-foreground)] leading-relaxed">
                        {questions[quizState.currentQuestion]?.question}
                      </h3>
                      <div className="flex gap-2 mt-3">
                        <span className="inline-block px-2 sm:px-3 py-1 bg-[var(--primary)]/20 text-[var(--primary)] text-xs sm:text-sm rounded-full font-medium">
                          {questions[quizState.currentQuestion]?.category?.charAt(0).toUpperCase() + questions[quizState.currentQuestion]?.category?.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid gap-2 sm:gap-3">
                      {questions[quizState.currentQuestion]?.options.map((option, index) => {
                        const isSelected = quizState.answers[quizState.currentQuestion] === index;
                        
                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={quizState.isCompleted}
                            className={`p-3 sm:p-4 rounded-lg border-2 text-left transition-all duration-200 ${
                              isSelected
                                ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-md'
                                : 'border-[var(--border)] bg-[var(--background)] hover:border-[var(--primary)]/50 hover:bg-[var(--primary)]/5'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center mr-2 sm:mr-3 font-semibold text-sm sm:text-base ${
                                isSelected 
                                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)]' 
                                  : 'bg-[var(--background-tertiary)] text-[var(--foreground-muted)]'
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="flex-1 text-[var(--foreground)] text-sm sm:text-base">{option}</span>
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  </motion.div>

                  {/* Navigation Buttons */}
                  <motion.div 
                    className="flex justify-between pt-4"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={prevQuestion}
                      disabled={quizState.currentQuestion === 0}
                      className="bg-[var(--secondary)] text-[var(--foreground)] py-2 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 text-sm sm:text-base"
                    >
                      Previous
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextQuestion}
                      className="bg-[var(--primary)] text-[var(--primary-foreground)] py-2 sm:py-3 px-4 sm:px-8 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200 text-sm sm:text-base"
                    >
                      {quizState.currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                    </motion.button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* Custom CSS for range inputs */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          cursor: pointer;
          border: 2px solid var(--background);
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 18px;
          width: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-light));
          cursor: pointer;
          border: 2px solid var(--background);
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}