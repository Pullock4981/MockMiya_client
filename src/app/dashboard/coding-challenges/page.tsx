'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizConfig, QuizState, QuizQuestion, QuestionCategory } from '../../dashboard/coding-challenges/types/quiz';
import { quizRoles, defaultQuizConfigs, questionCategories } from '../../dashboard/coding-challenges/data/quizData';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

const cardVariants = {
  hidden: { scale: 0.9, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30
    }
  },
  exit: {
    scale: 0.9,
    opacity: 0,
    transition: {
      duration: 0.2
    }
  }
};

const progressVariants = {
  initial: { width: 0 },
  animate: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

export default function CodingChallenges() {
  const pathname = usePathname();
  const [config, setConfig] = useState<QuizConfig>({
    roleId: '',
    duration: 5,
    questionCount: 10,
  });
  const [quizState, setQuizState] = useState<QuizState | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showLeftPanel, setShowLeftPanel] = useState(true);

  const selectedRole = quizRoles.find(role => role.id === config.roleId);
  const selectedCategory = questionCategories.find(cat => cat.id === config.category);

  const generateRandomQuestions = useCallback((roleId: string, count: number, category?: QuestionCategory): QuizQuestion[] => {
    const role = quizRoles.find(r => r.id === roleId);
    if (!role) return [];
    
    // Filter questions by category if specified
    let filteredQuestions = role.questions;
    if (category) {
      filteredQuestions = role.questions.filter(q => q.category === category);
    }
    
    // If no questions found for the selected category, show a message and return all questions
    if (filteredQuestions.length === 0) {
      console.warn(`No questions found for category: ${category}. Showing all questions.`);
      filteredQuestions = role.questions;
    }
    
    const shuffled = [...filteredQuestions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, filteredQuestions.length));
  }, []);

  const startQuiz = async () => {
    if (!config.roleId) {
      alert('Please select a role');
      return;
    }

    setIsLoading(true);
    
    // Simulate loading for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const generatedQuestions = generateRandomQuestions(config.roleId, config.questionCount, config.category);
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
    setShowLeftPanel(false); // Hide left panel when quiz starts
    setIsLoading(false);
  };

  const resetQuiz = () => {
    setQuizState(null);
    setQuestions([]);
    setShowReview(false);
    setShowLeftPanel(true); // Show left panel when quiz is reset
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
      setShowLeftPanel(true); // Show left panel when quiz is completed
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
          setShowLeftPanel(true); // Show left panel when time runs out
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
    
    const totalAllowedSeconds = config.duration * 60;
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
    
    const totalAllowedSeconds = config.duration * 60;
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
  const getIncorrectAnswers = () => {
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
    }).filter(Boolean);
  };

  // Get all answers for full review
  const getAllAnswers = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8 text-center"
        >
          <h1 className="text-4xl p-2 font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Coding Challenges
          </h1>
          <p className="text-gray-500">Test your skills with role-based assessments</p>
        </motion.div>

        <div className={`grid gap-6 lg:gap-8 ${
          showLeftPanel ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'
        }`}>
          {/* Left Side - Configuration */}
          <AnimatePresence>
            {showLeftPanel && (
              <motion.div
                key="left-panel"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border-white/20 p-6 lg:p-8"
              >
                <motion.h2 
                  className="text-2xl font-bold text-gray-800 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Quiz Configuration
                </motion.h2>
                
                <motion.div variants={containerVariants} className="space-y-6">
                  {/* Role Selection */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Select Your Role
                    </label>
                    <div className="relative">
                      <select
                        value={config.roleId}
                        onChange={(e) => setConfig({ ...config, roleId: e.target.value })}
                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                        disabled={!!quizState}
                      >
                        <option value="">Choose a professional role</option>
                        {quizRoles.map((role) => (
                          <option key={role.id} value={role.id}>
                            {role.name}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        ▼
                      </div>
                    </div>
                    {selectedRole && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-600 bg-blue-50/50 p-3 rounded-xl"
                      >
                        {selectedRole.description}
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Question Category Selection */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Questions Category
                    </label>
                    <div className="relative">
                      <select
                        value={config.category || ''}
                        onChange={(e) => setConfig({ 
                          ...config, 
                          category: e.target.value ? e.target.value as QuestionCategory : undefined 
                        })}
                        className="w-full px-4 py-3.5 bg-white/50 border-2 border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 appearance-none cursor-pointer"
                        disabled={!!quizState}
                      >
                        <option value="">All Levels (Mixed Difficulty)</option>
                        {questionCategories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name} - {category.description}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                        ▼
                      </div>
                    </div>
                    {selectedCategory && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-600 bg-green-50/50 p-3 rounded-xl border border-green-200"
                      >
                        <span className="font-semibold text-green-700">{selectedCategory.name}:</span> {selectedCategory.description}
                      </motion.p>
                    )}
                    {!config.category && (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-sm text-gray-600 bg-yellow-50/50 p-3 rounded-xl border border-yellow-200"
                      >
                        💡 Questions will be selected from all difficulty levels. Choose a specific category to focus on a particular difficulty.
                      </motion.p>
                    )}
                  </motion.div>

                  {/* Timer and Questions Selection */}
                  <motion.div variants={itemVariants} className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">
                      Quiz Settings
                    </label>
                    <div className="grid gap-3">
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
                          className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                            config.duration === configOption.duration && !isCustomizing
                              ? 'border-blue-500 bg-gradient-to-r from-blue-50 to-blue-100/50 shadow-md'
                              : 'border-gray-200 bg-white/50 hover:border-blue-300'
                          }`}
                          disabled={!!quizState}
                        >
                          <div className="font-semibold text-gray-800">{configOption.label}</div>
                        </motion.button>
                      ))}
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsCustomizing(true)}
                        className={`p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                          isCustomizing
                            ? 'border-purple-500 bg-gradient-to-r from-purple-50 to-purple-100/50 shadow-md'
                            : 'border-gray-200 bg-white/50 hover:border-purple-300'
                        }`}
                        disabled={!!quizState}
                      >
                        <div className="font-semibold text-gray-800">Custom Configuration</div>
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
                          <div className="mt-4 p-4 bg-gradient-to-br from-gray-50 to-blue-50/30 rounded-2xl space-y-4 border border-gray-200">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes)
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="60"
                                value={config.duration}
                                onChange={(e) => setConfig({ ...config, duration: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-sm text-gray-600 mt-1">
                                <span>1 min</span>
                                <span className="font-semibold text-blue-600">{config.duration} min</span>
                                <span>60 min</span>
                              </div>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Number of Questions
                              </label>
                              <input
                                type="range"
                                min="1"
                                max="30"
                                value={config.questionCount}
                                onChange={(e) => setConfig({ ...config, questionCount: parseInt(e.target.value) })}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                              />
                              <div className="flex justify-between text-sm text-gray-600 mt-1">
                                <span>1 question</span>
                                <span className="font-semibold text-blue-600">{config.questionCount} questions</span>
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
                    variants={itemVariants}
                    className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-5 text-white"
                  >
                    <h3 className="font-bold text-lg mb-3">Ready to Start</h3>
                    <div className="space-y-2 text-sm">
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
                  <motion.div variants={itemVariants} className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startQuiz}
                      disabled={!!quizState || !config.roleId || isLoading}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                    >
                      {isLoading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
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
                      className="flex-1 bg-gradient-to-r from-gray-600 to-gray-700 text-white py-4 px-6 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      Reset
                    </motion.button>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Side - Quiz Interface */}
          <motion.div
            layout
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className={`bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 lg:p-8 ${
              !showLeftPanel ? 'lg:col-span-2' : ''
            }`}
          >
            <motion.h2 
              className="text-2xl font-bold text-gray-800 mb-6"
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
                  className="text-center py-16"
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
                    className="text-8xl mb-6"
                  >
                    📝
                  </motion.div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-3">
                    Ready to Challenge Yourself?
                  </h3>
                  <p className="text-gray-500 text-lg max-w-md mx-auto">
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
                    className="space-y-6"
                  >
                    {/* Review Header */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Review</h3>
                      <p className="text-gray-600">Review your answers and explanations</p>
                    </div>

                    {/* Review Tabs */}
                    <div className="flex border-b border-gray-200">
                      <button
                        onClick={() => setShowReview(true)}
                        className={`flex-1 py-3 font-semibold border-b-2 ${
                          showReview 
                            ? 'border-blue-500 text-blue-600' 
                            : 'border-transparent text-gray-500'
                        }`}
                      >
                        All Questions ({allAnswers.length})
                      </button>
                    </div>

                    {/* Questions Review */}
                    <div className="space-y-6 max-h-[500px] overflow-y-auto">
                      {allAnswers.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className={`p-4 rounded-2xl border-2 ${
                            item.isCorrect 
                              ? 'border-green-200 bg-green-50' 
                              : 'border-red-200 bg-red-50'
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <span className="font-semibold text-gray-700">
                                Question {item.questionNumber}
                              </span>
                              <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                                item.isCorrect 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {item.isCorrect ? 'Correct' : 'Incorrect'}
                              </span>
                              <span className="ml-2 px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {item.question.category?.charAt(0).toUpperCase() + item.question.category?.slice(1)}
                              </span>
                            </div>
                          </div>

                          <h4 className="font-semibold text-gray-800 mb-3">
                            {item.question.question}
                          </h4>

                          {/* User Answer */}
                          <div className="mb-2">
                            <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                            <div className={`p-3 rounded-lg mt-1 ${
                              item.isCorrect 
                                ? 'bg-green-100 border border-green-200' 
                                : 'bg-red-100 border border-red-200'
                            }`}>
                              <span className={`font-medium ${
                                item.isCorrect ? 'text-green-800' : 'text-red-800'
                              }`}>
                                {String.fromCharCode(65 + item.userAnswer)}. {item.question.options[item.userAnswer]}
                              </span>
                              {!item.isCorrect && (
                                <span className="ml-2 text-red-600">❌</span>
                              )}
                            </div>
                          </div>

                          {/* Correct Answer */}
                          {!item.isCorrect && (
                            <div className="mb-3">
                              <span className="text-sm font-medium text-gray-600">Correct Answer:</span>
                              <div className="p-3 rounded-lg mt-1 bg-green-100 border border-green-200">
                                <span className="font-medium text-green-800">
                                  {String.fromCharCode(65 + item.correctAnswer)}. {item.question.options[item.correctAnswer]}
                                </span>
                                <span className="ml-2 text-green-600">✅</span>
                              </div>
                            </div>
                          )}

                          {/* Explanation */}
                          {item.question.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                              <span className="text-sm font-medium text-blue-700">Explanation:</span>
                              <p className="text-blue-800 mt-1 text-sm">{item.question.explanation}</p>
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
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
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
                    className="text-center py-8"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                      className="text-8xl mb-6"
                    >
                      🎉
                    </motion.div>
                    
                    <motion.h3 
                      className="text-3xl font-bold text-gray-800 mb-6"
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
                      className="mb-6"
                    >
                      <p className="text-xl font-semibold text-purple-600">
                        {getPerformanceMessage(quizState.score, questions.length)}
                      </p>
                    </motion.div>

                    {/* Stats Grid */}
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid grid-cols-2 gap-4 mb-8 max-w-md mx-auto"
                    >
                      <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-4 text-white"
                      >
                        <div className="text-2xl font-bold">{quizState.score}/{questions.length}</div>
                        <div className="text-sm opacity-90">Score</div>
                      </motion.div>
                      
                      <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 text-white"
                      >
                        <div className="text-2xl font-bold">{((quizState.score / questions.length) * 100).toFixed(1)}%</div>
                        <div className="text-sm opacity-90">Accuracy</div>
                      </motion.div>
                      
                      <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-4 text-white"
                      >
                        <div className="text-2xl font-bold">{calculateTimeTaken()}</div>
                        <div className="text-sm opacity-90">Time Taken</div>
                      </motion.div>
                      
                      <motion.div
                        variants={itemVariants}
                        className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-4 text-white"
                      >
                        <div className="text-2xl font-bold">
                          {completedBeforeTimeLimit() ? calculateTimeSaved() : '0:00'}
                        </div>
                        <div className="text-sm opacity-90">Time Saved</div>
                      </motion.div>
                    </motion.div>

                    {/* Incorrect Answers Summary */}
                    {incorrectAnswers.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mb-6 p-4 bg-red-50 rounded-2xl border border-red-200"
                      >
                        <div className="flex items-center justify-center mb-2">
                          <span className="text-red-600 text-lg font-semibold">
                            {incorrectAnswers.length} Incorrect Answer{incorrectAnswers.length !== 1 ? 's' : ''}
                          </span>
                        </div>
                        <p className="text-red-700 text-sm mb-3">
                          Review your mistakes to improve your knowledge
                        </p>
                      </motion.div>
                    )}

                    {/* Additional Info */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="space-y-3 text-sm text-gray-600 mb-8"
                    >
                      {completedBeforeTimeLimit() && (
                        <p className="text-green-600 font-semibold">
                          ⚡ You finished {calculateTimeSaved()} before the time limit!
                        </p>
                      )}
                      {quizState.timeRemaining <= 0 && !completedBeforeTimeLimit() && (
                        <p className="text-yellow-600 font-semibold">
                          ⏰ Times up! Your quiz was automatically submitted.
                        </p>
                      )}
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowReview(true)}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Review Answers
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={resetQuiz}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all duration-200"
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
                  className="space-y-6"
                >
                  {/* Quiz Header */}
                  <motion.div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-6 text-white"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-bold text-lg">{selectedRole?.name}</h3>
                        <p className="text-blue-100 text-sm">
                          Question {quizState.currentQuestion + 1} of {questions.length}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-100 text-sm">Time Remaining</p>
                        <p className={`text-2xl font-bold ${
                          quizState.timeRemaining < 60 ? 'text-red-300 animate-pulse' : 'text-white'
                        }`}>
                          {formatTime(quizState.timeRemaining)}
                        </p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full shadow-inner"
                      variants={progressVariants}
                      initial="initial"
                      animate="animate"
                      custom={((quizState.currentQuestion + 1) / questions.length) * 100}
                    />
                  </div>

                  {/* Current Question */}
                  <motion.div
                    key={quizState.currentQuestion}
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="space-y-6"
                  >
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                      <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                        {questions[quizState.currentQuestion]?.question}
                      </h3>
                      <div className="flex gap-2 mt-3">
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-600 text-sm rounded-full font-medium">
                          {questions[quizState.currentQuestion]?.category?.charAt(0).toUpperCase() + questions[quizState.currentQuestion]?.category?.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="grid gap-3">
                      {questions[quizState.currentQuestion]?.options.map((option, index) => {
                        const isSelected = quizState.answers[quizState.currentQuestion] === index;
                        const isCorrect = index === questions[quizState.currentQuestion]?.correctAnswer;
                        
                        return (
                          <motion.button
                            key={index}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswerSelect(index)}
                            disabled={quizState.isCompleted}
                            className={`p-4 rounded-2xl border-2 text-left transition-all duration-200 ${
                              isSelected
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50'
                            }`}
                          >
                            <div className="flex items-center">
                              <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 font-semibold ${
                                isSelected 
                                  ? 'bg-blue-500 text-white' 
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {String.fromCharCode(65 + index)}
                              </span>
                              <span className="flex-1">{option}</span>
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
                      className="bg-gray-600 text-white py-3 px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      Previous
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={nextQuestion}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-8 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
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
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
}