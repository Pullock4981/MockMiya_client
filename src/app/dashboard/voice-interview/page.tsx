
'use client';

import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, StopCircle, RotateCcw, Download, User, Bot, Clock, Star, CheckCircle, XCircle, HelpCircle, Volume2, VolumeX, Building, Award, Play } from 'lucide-react';
import { LoadingSpinner } from '../components/Loading';

interface InterviewMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  score?: number;
  feedback?: string;
  type?: 'question' | 'feedback' | 'general';
}

interface InterviewConfig {
  name: string;
  jobRole: string;
  company: string;
  duration: 10 | 15 | 30;
}

interface QuestionTimer {
  question: string;
  startTime: Date;
  timeLimit: number;
  answered: boolean;
  score: number;
  timeLeft: number;
}

interface EvaluationResult {
  score: 'FULL_CORRECT' | 'HALF_CORRECT' | 'INCORRECT';
  feedback: string;
  nextQuestion: string;
}

export default function VoiceInterviewPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [currentResponse, setCurrentResponse] = useState('');
  const [showInterview, setShowInterview] = useState(false);
  const [interviewConfig, setInterviewConfig] = useState<InterviewConfig>({
    name: '',
    jobRole: 'Software Engineer',
    company: 'Tech Company',
    duration: 15
  });
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [currentQuestionTimer, setCurrentQuestionTimer] = useState<QuestionTimer | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState('');
  const [previousScore, setPreviousScore] = useState<string>('');

  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const interviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  const conversationEndRef = useRef<HTMLDivElement>(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  // Scroll to bottom of conversation
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [interviewHistory]);

  // Initialize on client mount
  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Clean up timers and speech synthesis
  useEffect(() => {
    return () => {
      if (synthesisRef.current) {
        window.speechSynthesis.cancel();
      }
      if (interviewTimerRef.current) {
        clearInterval(interviewTimerRef.current);
      }
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
    };
  }, []);

  // Start interview countdown
  const startInterviewTimer = (duration: number) => {
    setTimeRemaining(duration * 60);

    interviewTimerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          endInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Start question timer (45 seconds)
  const startQuestionTimer = (question: string) => {
    const timeLimit = 45;
    setCurrentQuestionTimer({
      question,
      startTime: new Date(),
      timeLimit,
      answered: false,
      score: 1,
      timeLeft: timeLimit
    });

    questionTimerRef.current = setInterval(() => {
      setCurrentQuestionTimer(prev => {
        if (!prev) return null;

        const elapsed = Math.floor((new Date().getTime() - prev.startTime.getTime()) / 1000);
        const timeLeft = Math.max(0, prev.timeLimit - elapsed);

        if (timeLeft <= 0) {
          if (questionTimerRef.current) {
            clearInterval(questionTimerRef.current);
          }
          handleAutoSubmit();
          return null;
        }

        return {
          ...prev,
          timeLeft
        };
      });
    }, 1000);
  };

  const handleAutoSubmit = async () => {
    if (transcript.trim()) {
      await handleUserSpeechComplete();
    } else {
      const penaltyMessage: InterviewMessage = {
        role: 'assistant',
        content: "Time's up! You didn't provide an answer in time. This will be marked as incorrect. Let's move to the next question.",
        timestamp: new Date(),
        type: 'feedback'
      };

      setInterviewHistory(prev => [...prev, penaltyMessage]);
      if (soundEnabled) speakText(penaltyMessage.content);

      setTotalScore(prev => prev + 0);
      setQuestionsAnswered(prev => prev + 1);
      setPreviousScore('INCORRECT');

      setTimeout(() => {
        getNextQuestion();
      }, 3000);
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Start the interview
  const startInterview = async () => {
    if (!interviewConfig.name.trim() || !interviewConfig.jobRole.trim()) {
      alert('Please enter your name and job role');
      return;
    }

    setShowInterview(true);
    setInterviewStarted(true);
    startInterviewTimer(interviewConfig.duration);

    await getNextQuestion();
  };

  // End interview and get final feedback
  const endInterview = async () => {
    setInterviewStarted(false);
    setInterviewCompleted(true);

    if (interviewTimerRef.current) {
      clearInterval(interviewTimerRef.current);
    }
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }

    await getFinalFeedback();
  };

  // Parse evaluation result from API
  const parseEvaluationResult = (text: string): EvaluationResult => {
    const defaultResult: EvaluationResult = {
      score: 'INCORRECT',
      feedback: 'Thank you for your answer. Let me provide the next question.',
      nextQuestion: "Can you tell me about your experience with relevant technologies for this role?"
    };

    try {
      let score: EvaluationResult['score'] = 'INCORRECT';
      if (text.includes('FULL_CORRECT')) {
        score = 'FULL_CORRECT';
      } else if (text.includes('HALF_CORRECT')) {
        score = 'HALF_CORRECT';
      } else if (text.includes('INCORRECT')) {
        score = 'INCORRECT';
      }

      let feedback = defaultResult.feedback;
      const feedbackMatch = text.match(/FEEDBACK:\s*([^\n]+)/i);
      if (feedbackMatch) {
        feedback = feedbackMatch[1].trim();
      }

      let nextQuestion = defaultResult.nextQuestion;
      const questionMatch = text.match(/NEXT_QUESTION:\s*([^\n]+)/i);
      if (questionMatch) {
        nextQuestion = questionMatch[1].trim();
      }

      feedback = feedback.replace(/^FEEDBACK:\s*/i, '').trim();
      nextQuestion = nextQuestion.replace(/^NEXT_QUESTION:\s*/i, '').trim();

      return {
        score,
        feedback: feedback || defaultResult.feedback,
        nextQuestion: nextQuestion || defaultResult.nextQuestion
      };
    } catch (error) {
      return defaultResult;
    }
  };

  // Calculate numeric score from evaluation
  const getNumericScore = (score: EvaluationResult['score']): number => {
    switch (score) {
      case 'FULL_CORRECT': return 1;
      case 'HALF_CORRECT': return 0.5;
      case 'INCORRECT': return 0;
      default: return 0;
    }
  };

  // Get next question from API
  const getNextQuestion = async () => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }

    try {
      setIsProcessing(true);

      const response = await fetch('/api/voice-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: interviewConfig.name,
          jobRole: interviewConfig.jobRole,
          companyName: interviewConfig.company,
          conversationHistory: interviewHistory.map(msg =>
            `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`
          ).join('\n'),
          lastUserMessage: transcript || 'Start the interview',
          getQuestion: true,
          previousScore: previousScore
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get question');
      }

      const data = await response.json();
      const question = data.text;

      const questionMessage: InterviewMessage = {
        role: 'assistant',
        content: question,
        timestamp: new Date(),
        type: 'question'
      };

      setInterviewHistory(prev => [...prev, questionMessage]);
      setCurrentResponse(question);
      if (soundEnabled) speakText(question);

      startQuestionTimer(question);

    } catch (error) {
      const fallbackQuestion = "Can you tell me about your experience relevant to this role?";
      const questionMessage: InterviewMessage = {
        role: 'assistant',
        content: fallbackQuestion,
        timestamp: new Date(),
        type: 'question'
      };
      setInterviewHistory(prev => [...prev, questionMessage]);
      if (soundEnabled) speakText(fallbackQuestion);
      startQuestionTimer(fallbackQuestion);
    } finally {
      setIsProcessing(false);
    }
  };

  // Get final feedback
  const getFinalFeedback = async () => {
    try {
      const response = await fetch('/api/voice-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: interviewConfig.name,
          jobRole: interviewConfig.jobRole,
          companyName: interviewConfig.company,
          conversationHistory: interviewHistory.map(msg =>
            `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`
          ).join('\n'),
          lastUserMessage: 'Interview completed',
          getFeedback: true,
          totalScore: totalScore,
          questionsAnswered: questionsAnswered
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get feedback');
      }

      const data = await response.json();
      setFinalFeedback(data.text);
      if (soundEnabled) speakText("Interview completed. Here's your feedback: " + data.text);

    } catch (error) {
      setFinalFeedback("Thank you for completing the interview. Based on your responses, you demonstrated good knowledge in some areas. Continue practicing to improve your interview skills.");
      if (soundEnabled) speakText("Interview completed. Thank you for your participation.");
    }
  };

  // Evaluate answer and get next question
  const evaluateAnswer = async (userMessage: string): Promise<EvaluationResult> => {
    try {
      const response = await fetch('/api/voice-interview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: interviewConfig.name,
          jobRole: interviewConfig.jobRole,
          companyName: interviewConfig.company,
          conversationHistory: interviewHistory.map(msg =>
            `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`
          ).join('\n'),
          lastUserMessage: userMessage,
          evaluateAnswer: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to evaluate answer');
      }

      const data = await response.json();

      if (!data.text) {
        throw new Error('No text in API response');
      }

      return parseEvaluationResult(data.text);

    } catch (error) {
      return {
        score: 'INCORRECT',
        feedback: 'Thank you for your response. Let me ask you another question.',
        nextQuestion: "Could you tell me more about your relevant experience for this position?"
      };
    }
  };

  // Text-to-Speech function
  const speakText = (text: string) => {
    if (!hasMounted || !window.speechSynthesis || !soundEnabled) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthesisRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech
  const stopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
    if (!soundEnabled) {
      stopSpeech();
    }
  };

  // Handle user speech completion
  const handleUserSpeechComplete = async () => {
    if (!transcript.trim()) return;

    const userMessage: InterviewMessage = {
      role: 'user',
      content: transcript,
      timestamp: new Date()
    };

    try {
      setInterviewHistory(prev => [...prev, userMessage]);

      const evaluation = await evaluateAnswer(transcript);
      const numericScore = getNumericScore(evaluation.score);

      setPreviousScore(evaluation.score);

      setInterviewHistory(prev =>
        prev.map((msg, index) =>
          index === prev.length - 1 && msg.role === 'user'
            ? { ...msg, score: numericScore, feedback: evaluation.feedback }
            : msg
        )
      );

      const feedbackMessage: InterviewMessage = {
        role: 'assistant',
        content: evaluation.feedback,
        timestamp: new Date(),
        type: 'feedback'
      };

      setInterviewHistory(prev => [...prev, feedbackMessage]);

      if (soundEnabled) speakText(evaluation.feedback);

      setTotalScore(prev => prev + numericScore);
      setQuestionsAnswered(prev => prev + 1);

      setTimeout(() => {
        const nextQuestionMessage: InterviewMessage = {
          role: 'assistant',
          content: evaluation.nextQuestion,
          timestamp: new Date(),
          type: 'question'
        };

        setInterviewHistory(prev => [...prev, nextQuestionMessage]);
        setCurrentResponse(evaluation.nextQuestion);

        if (soundEnabled) speakText(evaluation.nextQuestion);

        startQuestionTimer(evaluation.nextQuestion);
      }, 3000);

    } catch (error) {
      const errorMessage: InterviewMessage = {
        role: 'assistant',
        content: "I appreciate your answer. Let's continue with the next question.",
        timestamp: new Date(),
        type: 'feedback'
      };
      setInterviewHistory(prev => [...prev, errorMessage]);
      if (soundEnabled) speakText("Let's continue with the next question.");

      setTimeout(() => {
        getNextQuestion();
      }, 2000);
    } finally {
      resetTranscript();
      if (questionTimerRef.current) {
        clearInterval(questionTimerRef.current);
      }
      setCurrentQuestionTimer(null);
    }
  };

  // Start listening
  const startListening = () => {
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  // Stop listening and process
  const stopListening = async () => {
    SpeechRecognition.stopListening();
    if (transcript.trim()) {
      await handleUserSpeechComplete();
    }
  };

  // Reset interview
  const resetInterview = () => {
    resetTranscript();
    stopSpeech();
    setShowInterview(false);
    setInterviewStarted(false);
    setInterviewCompleted(false);
    setInterviewHistory([]);
    setCurrentResponse('');
    setTotalScore(0);
    setQuestionsAnswered(0);
    setTimeRemaining(0);
    setCurrentQuestionTimer(null);
    setFinalFeedback('');
    setPreviousScore('');

    if (interviewTimerRef.current) {
      clearInterval(interviewTimerRef.current);
    }
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }
  };

  // Download transcript
  const downloadTranscript = () => {
    const transcriptText = interviewHistory.map(msg =>
      `${msg.role === 'user' ? 'CANDIDATE' : 'INTERVIEWER'} (${msg.timestamp.toLocaleTimeString()})${msg.score !== undefined ? ` [Score: ${msg.score}/1]` : ''}:\n${msg.content}${msg.feedback ? `\nFeedback: ${msg.feedback}` : ''}\n\n`
    ).join('---\n\n') +
      `\n\nFINAL SCORE: ${totalScore.toFixed(1)}/${questionsAnswered}\nFEEDBACK:\n${finalFeedback}`;

    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `interview-${interviewConfig.jobRole.replace(/\s+/g, '-')}-${new Date().getTime()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Manual send message
  const handleManualSend = async () => {
    if (!transcript.trim()) return;
    await handleUserSpeechComplete();
  };

  // Get score icon and color
  const getScoreDisplay = (score?: number) => {
    if (score === undefined) return null;

    if (score === 1) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'text-[var(--success)]',
        bgColor: 'bg-[var(--success)]/10',
        text: 'Full Correct'
      };
    } else if (score === 0.5) {
      return {
        icon: <HelpCircle className="w-4 h-4" />,
        color: 'text-[var(--warning)]',
        bgColor: 'bg-[var(--warning)]/10',
        text: 'Half Correct'
      };
    } else {
      return {
        icon: <XCircle className="w-4 h-4" />,
        color: 'text-[var(--destructive)]',
        bgColor: 'bg-[var(--destructive)]/10',
        text: 'Incorrect'
      };
    }
  };

  // Calculate progress percentage
  const progressPercentage = interviewConfig.duration ? ((interviewConfig.duration * 60 - timeRemaining) / (interviewConfig.duration * 60)) * 100 : 0;

  // Hydration fix
  if (!hasMounted) {
    return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">Loading...</div>;
  }

  if (!browserSupportsSpeechRecognition) {
    return <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">Browser not supported</div>;
  }

  return (
    <div className="min-h-screen bg-[var(--background)] transition-colors duration-300">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 lg:mb-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="text-2xl sm:text-3xl">🎙️</div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[var(--card-foreground)]">
              AI Voice Interview
            </h1>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto px-4">
            Practice your interview skills with real-time AI feedback
          </p>
        </div>

        {!showInterview ? (
          // Configuration Screen - Mobile First
          <div className="max-w-2xl mx-auto px-2 sm:px-0">
            <div className="border-[var(--border)] bg-[var(--card)] shadow-lg sm:shadow-xl rounded-xl sm:rounded-2xl overflow-hidden">
              <CardHeader className="text-center p-4 sm:p-6 lg:p-8 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--primary-light)]/5 border-b border-[var(--border)]">
                <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--card-foreground)] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
                  <div className="p-2 sm:p-3 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg sm:rounded-xl">
                    <User className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" />
                  </div>
                  Interview Setup
                </CardTitle>
                <p className="text-sm sm:text-base text-[var(--foreground-muted)] mt-2">
                  Configure your personalized interview session
                </p>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] flex items-center gap-2">
                      <User className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={interviewConfig.name}
                      onChange={(e) => setInterviewConfig(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-3 border border-[var(--border)] bg-[var(--background)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder-[var(--foreground-muted)] text-sm sm:text-base"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] flex items-center gap-2">
                      <Award className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                      Job Role *
                    </label>
                    <input
                      type="text"
                      value={interviewConfig.jobRole}
                      onChange={(e) => setInterviewConfig(prev => ({ ...prev, jobRole: e.target.value }))}
                      className="w-full p-3 border border-[var(--border)] bg-[var(--background)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder-[var(--foreground-muted)] text-sm sm:text-base"
                      placeholder="e.g., Software Engineer, Product Manager"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] flex items-center gap-2">
                      <Building className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                      Company
                    </label>
                    <input
                      type="text"
                      value={interviewConfig.company}
                      onChange={(e) => setInterviewConfig(prev => ({ ...prev, company: e.target.value }))}
                      className="w-full p-3 border border-[var(--border)] bg-[var(--background)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder-[var(--foreground-muted)] text-sm sm:text-base"
                      placeholder="Target company (optional)"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)] flex items-center gap-2">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                      Interview Duration
                    </label>
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                      {[10, 15, 30].map((duration) => (
                        <Button
                          key={duration}
                          onClick={() => setInterviewConfig(prev => ({ ...prev, duration: duration as 10 | 15 | 30 }))}
                          className={`p-2 sm:p-3 rounded-lg border transition-all duration-300 text-xs sm:text-sm ${
                            interviewConfig.duration === duration
                              ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-[var(--primary)] shadow-lg'
                              : 'border-[var(--border)] text-[var(--foreground)] bg-[var(--background)] hover:border-[var(--primary)]'
                          }`}
                        >
                          {duration} min
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={startInterview}
                  className="w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-3 sm:py-4 rounded-lg text-sm sm:text-base font-semibold hover:shadow-lg transition-all hover:scale-105 active:scale-95"
                  size="lg"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                  Start Interview Practice
                </Button>
              </CardContent>
            </div>
          </div>
        ) : (
          // Interview Screen - Mobile First
          <div className="w-full max-w-5xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
            {/* Interview Header */}
            <Card className="border-[var(--border)] bg-[var(--card)] shadow-lg rounded-xl sm:rounded-2xl">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="text-xl sm:text-2xl">🎙️</div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--card-foreground)] truncate">
                        Interview in Progress
                      </h2>
                      <p className="text-xs sm:text-sm text-[var(--foreground-muted)] truncate">
                        Role: {interviewConfig.jobRole}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start">
                    <div className="flex items-center gap-2 bg-[var(--background-secondary)] px-3 py-1 sm:px-4 sm:py-2 rounded-lg border border-[var(--border)]">
                      <Clock className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                      <span className="font-bold text-[var(--foreground)] text-sm sm:text-base">
                        {formatTime(timeRemaining)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-[var(--background-secondary)] px-3 py-1 sm:px-4 sm:py-2 rounded-lg border border-[var(--border)]">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-[var(--primary)]" />
                      <span className="font-bold text-[var(--foreground)] text-sm sm:text-base">
                        {totalScore.toFixed(1)}/{questionsAnswered}
                      </span>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                {/* Progress Bar */}
                <div className="w-full bg-[var(--background-tertiary)] rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>

                {/* Info Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm mb-4">
                  <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] text-center">
                    <div className="text-[var(--foreground-secondary)] font-semibold">Candidate</div>
                    <div className="text-[var(--foreground)] font-bold truncate">{interviewConfig.name}</div>
                  </div>
                  <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] text-center">
                    <div className="text-[var(--foreground-secondary)] font-semibold">Role</div>
                    <div className="text-[var(--foreground)] font-bold truncate">{interviewConfig.jobRole}</div>
                  </div>
                  <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] text-center">
                    <div className="text-[var(--foreground-secondary)] font-semibold">Company</div>
                    <div className="text-[var(--foreground)] font-bold truncate">{interviewConfig.company}</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                  <Button
                    onClick={toggleSound}
                    className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)] py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-xs sm:text-sm flex items-center gap-2"
                  >
                    {soundEnabled ? <Volume2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <VolumeX className="w-3 h-3 sm:w-4 sm:h-4" />}
                    <span className="hidden xs:inline">{soundEnabled ? 'Sound On' : 'Sound Off'}</span>
                  </Button>
                  <Button
                    onClick={downloadTranscript}
                    className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)] py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-xs sm:text-sm flex items-center gap-2"
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Transcript</span>
                  </Button>
                  <Button
                    onClick={resetInterview}
                    className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)] py-2 px-3 sm:py-3 sm:px-4 rounded-lg text-xs sm:text-sm flex items-center gap-2"
                  >
                    <RotateCcw className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden xs:inline">Restart</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Interview Completed Feedback */}
            {interviewCompleted && finalFeedback && (
              <Card className="border-[var(--border)] bg-[var(--card)] shadow-lg rounded-xl sm:rounded-2xl">
                <CardHeader className="text-center p-4 sm:p-6">
                  <CardTitle className="flex flex-col items-center justify-center gap-3">
                    <div className="animate-bounce text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6">🎉</div>
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--card-foreground)]">
                      Interview Complete!
                    </h2>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  <div className="space-y-4 sm:space-y-6">
                    <div className="text-center">
                      <div className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-2">
                        {((totalScore / questionsAnswered) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm sm:text-lg text-[var(--foreground-muted)]">
                        Final Score: {totalScore.toFixed(1)}/{questionsAnswered}
                      </div>
                    </div>

                    <div className="p-4 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                      <h3 className="font-bold text-[var(--foreground)] text-lg mb-3 text-center">Detailed Feedback</h3>
                      <p className="text-[var(--foreground)] leading-relaxed whitespace-pre-wrap text-sm sm:text-base">
                        {finalFeedback}
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        onClick={resetInterview}
                        className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)] py-3"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Start New Interview
                      </Button>
                      <Button
                        onClick={downloadTranscript}
                        className="flex-1 bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)] py-3"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download Transcript
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interview Conversation & Controls */}
            {!interviewCompleted && (
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
                {/* Conversation Panel */}
                <div className="xl:col-span-2">
                  <Card className="border-[var(--border)] bg-[var(--card)] shadow-lg rounded-xl sm:rounded-2xl h-full">
                    <CardHeader className="p-4 sm:p-6">
                      <CardTitle className="flex items-center gap-2 sm:gap-3 text-[var(--card-foreground)] text-sm sm:text-base lg:text-lg">
                        <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)]" />
                        Interview Conversation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="space-y-3 sm:space-y-4 max-h-[400px] sm:max-h-[500px] overflow-y-auto p-3 sm:p-4 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)]">
                        {interviewHistory.length === 0 ? (
                          <div className="text-center py-8 sm:py-12 text-[var(--foreground-muted)]">
                            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🎤</div>
                            <p className="text-base sm:text-lg font-semibold">Get ready for your first question!</p>
                            <p className="text-xs sm:text-sm mt-1 sm:mt-2">Speak clearly and take your time to answer.</p>
                          </div>
                        ) : (

                          // ****************************************************************************************************************
                          interviewHistory.map((message, index) => (
                            <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[90%] sm:max-w-[85%] rounded-lg p-3 sm:p-4  ${
                                message.role === 'user' 
                                  ? 'bg-[var(--primary)] text-[var(--primary-foreground)] font-semibold rounded-br-none' 
                                  : message.type === 'feedback'
                                    ? 'bg-[var(--primary)]/10 border border-[var(--primary)]/20 font-semibold rounded-bl-none'
                                    : 'bg-[var(--primary)]/10 border border-[var(--primary)]/20 font-semibold rounded-bl-none'
                              }`}>
                                <div className="flex items-start gap-2 sm:gap-3">
                                  {message.role === 'assistant' && (
                                    <div className="p-1 sm:p-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full">
                                      <Bot className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </div>
                                  )}

                             {/* **************************************************************************************************************** */}
                                  <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start mb-2">
                                      <span className={`font-semibold text-xs sm:text-sm mr-5 ${message.role === 'user' ? 'text-[var(--primary-foreground)]' : 'text-[var(--foreground)]'}`}>
                                        {message.role === 'user' ? 'You' : 'Interviewer'}
                                      </span>
                                      <span className={`text-xs ${message.role === 'user' ? 'text-[var(--primary-foreground)]/80' : 'text-[var(--foreground-muted)]'}`}>
                                        {message.timestamp.toLocaleTimeString()}
                                      </span>
                                    </div>
                                    <p className="whitespace-pre-wrap leading-relaxed text-sm sm:text-base">
                                      {message.content}
                                    </p>
                                    
                                    {/* Score Display */}
                                    {message.score !== undefined && (
                                      <div className={`mt-2 sm:mt-3 flex items-center gap-2 p-2 rounded-lg ${getScoreDisplay(message.score)?.bgColor}`}>
                                        {getScoreDisplay(message.score)?.icon}
                                        <span className={`text-xs sm:text-sm font-medium ${getScoreDisplay(message.score)?.color}`}>
                                          {getScoreDisplay(message.score)?.text} ({message.score}/1)
                                        </span>
                                      </div>
                                    )}
                                    
                                    {/* Feedback Display */}
                                    {message.feedback && (
                                      <div className="mt-2 sm:mt-3 p-2 sm:p-3 bg-[var(--background)] rounded-lg border border-[var(--border)]">
                                        <strong className="text-xs sm:text-sm text-[var(--foreground-secondary)]">Feedback:</strong> 
                                        <p className="text-xs sm:text-sm text-[var(--foreground)] mt-1">{message.feedback}</p>
                                      </div>
                                    )}
                                  </div>
                                  {message.role === 'user' && (
                                    <div className="p-1 sm:p-2 bg-[var(--primary-foreground)] text-[var(--primary)] rounded-full">
                                      <User className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        <div ref={conversationEndRef} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Voice Controls Panel */}
                <div className="xl:col-span-1">
                  <Card className="border-[var(--border)] bg-[var(--card)] shadow-lg rounded-xl sm:rounded-2xl h-full">
                    <CardHeader className="p-3 sm:p-4 lg:p-6">
                      <CardTitle className="flex items-center justify-between gap-2 sm:gap-3 text-sm sm:text-base">
                        <div className="flex items-center gap-2 sm:gap-3 text-[var(--card-foreground)]">
                          <Mic className="w-4 h-4 sm:w-5 sm:h-5 text-[var(--primary)]" />
                          <span className="hidden xs:inline">Voice Controls</span>
                          <span className="xs:hidden">Controls</span>
                        </div>
                        {currentQuestionTimer && (
                          <div className="flex items-center gap-1 sm:gap-2 bg-[var(--primary)] text-[var(--primary-foreground)] px-2 py-1 sm:px-3 sm:py-2 rounded-lg">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="font-bold text-sm sm:text-base">{formatTime(currentQuestionTimer.timeLeft)}</span>
                          </div>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 sm:p-4 lg:p-6">
                      <div className="space-y-4 sm:space-y-6">
                        {/* Response Input */}
                        <div className="space-y-2 sm:space-y-3">
                          <label className="text-xs sm:text-sm font-semibold text-[var(--foreground-secondary)]">
                            Your Response {listening && <span className="text-[var(--primary)] animate-pulse ml-1 sm:ml-2">● Listening...</span>}
                          </label>
                          <Textarea
                            value={transcript}
                            readOnly
                            placeholder={listening ? "Speak now... I'm listening" : "Click 'Start Speaking' and begin your answer"}
                            className="min-h-[100px] sm:min-h-[120px] mt-2 resize-none border border-[var(--border)] bg-[var(--background)] rounded-lg focus:ring-2 focus:ring-[var(--primary)]/30 focus:border-[var(--primary)] transition-all text-[var(--foreground)] placeholder-[var(--foreground-muted)] text-sm sm:text-base p-3 font-semibold"
                          />
                        </div>
                        
                        {/* Control Buttons */}
                        <div className="grid grid-cols-2 gap-2 sm:gap-3">
                          <Button
                            onClick={startListening}
                            disabled={listening || isProcessing}
                            className="bg-[var(--primary)] text-[var(--primary-foreground)] hover:bg-[var(--primary-dark)] py-2 sm:py-3 rounded-lg text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                          >
                            <Mic className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Start</span>
                          </Button>
                          
                          <Button
                            onClick={stopListening}
                            disabled={!listening || isProcessing}
                            className="bg-[var(--secondary)] text-[var(--foreground)] hover:bg-[var(--background-tertiary)] py-2 sm:py-3 rounded-lg text-xs sm:text-sm flex items-center gap-1 sm:gap-2"
                          >
                            <StopCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="hidden xs:inline">Send</span>
                          </Button>

                          <Button
                            onClick={handleManualSend}
                            disabled={!transcript.trim() || isProcessing}
                            className="col-span-2 border border-[var(--border)] text-[var(--foreground)] bg-[var(--background)] hover:bg-[var(--background-secondary)] py-2 sm:py-3 rounded-lg text-xs sm:text-sm"
                          >
                            📨 Send Text Response
                          </Button>
                        </div>

                        {/* Current Question Display */}
                        {currentQuestionTimer && (
                          <div className="p-3 sm:p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-lg">
                            <div className="text-xs sm:text-sm text-[var(--foreground)]">
                              <strong className="text-[var(--primary)] text-sm sm:text-base">Current Question:</strong> 
                              <p className="mt-2 text-[var(--foreground)] font-semibold leading-relaxed text-sm sm:text-base">
                                {currentQuestionTimer.question}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );

    // Loading
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--background)] text-[var(--foreground)] transition-colors duration-300 p-4">
        <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 animate-pulse">
          💼
        </div>
        <p className="text-[var(--foreground-muted)] font-medium mb-3 sm:mb-4 text-sm sm:text-base text-center">
          Preparing your interview...
        </p>
        <LoadingSpinner />
      </div>
    );

}
