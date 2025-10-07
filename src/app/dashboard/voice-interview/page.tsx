'use client';

import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, StopCircle, RotateCcw, Play, Pause, Download, User, Bot, Clock, Star, CheckCircle, XCircle, HelpCircle, Volume2, VolumeX } from 'lucide-react';

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
      // No answer provided - score 0
      const penaltyMessage: InterviewMessage = {
        role: 'assistant',
        content: "Time's up! You didn't provide an answer in time. This will be marked as incorrect. Let's move to the next question.",
        timestamp: new Date(),
        type: 'feedback'
      };
      
      setInterviewHistory(prev => [...prev, penaltyMessage]);
      if (soundEnabled) speakText(penaltyMessage.content);
      
      // Update score
      setTotalScore(prev => prev + 0);
      setQuestionsAnswered(prev => prev + 1);
      setPreviousScore('INCORRECT');

      // Get next question after penalty
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
    
    // Get first question
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
    
    // Get final feedback
    await getFinalFeedback();
  };

  // Parse evaluation result from API
  const parseEvaluationResult = (text: string): EvaluationResult => {
    // Default fallback response
    const defaultResult: EvaluationResult = {
      score: 'INCORRECT',
      feedback: 'Thank you for your answer. Let me provide the next question.',
      nextQuestion: "Can you tell me about your experience with relevant technologies for this role?"
    };

    try {
      // Try to extract score using different patterns
      let score: EvaluationResult['score'] = 'INCORRECT';
      if (text.includes('FULL_CORRECT')) {
        score = 'FULL_CORRECT';
      } else if (text.includes('HALF_CORRECT')) {
        score = 'HALF_CORRECT';
      } else if (text.includes('INCORRECT')) {
        score = 'INCORRECT';
      }

      // Extract feedback
      let feedback = defaultResult.feedback;
      const feedbackMatch = text.match(/FEEDBACK:\s*([^\n]+)/i);
      if (feedbackMatch) {
        feedback = feedbackMatch[1].trim();
      }

      // Extract next question
      let nextQuestion = defaultResult.nextQuestion;
      const questionMatch = text.match(/NEXT_QUESTION:\s*([^\n]+)/i);
      if (questionMatch) {
        nextQuestion = questionMatch[1].trim();
      }

      // Clean up the extracted text
      feedback = feedback.replace(/^FEEDBACK:\s*/i, '').trim();
      nextQuestion = nextQuestion.replace(/^NEXT_QUESTION:\s*/i, '').trim();

      return {
        score,
        feedback: feedback || defaultResult.feedback,
        nextQuestion: nextQuestion || defaultResult.nextQuestion
      };
    } catch (error) {
      console.error('Error parsing evaluation result:', error);
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

      // Start timer for this question (45 seconds)
      startQuestionTimer(question);

    } catch (error) {
      console.error('Error getting question:', error);
      // Fallback question
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
      console.error('Error getting feedback:', error);
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
      console.error('Error evaluating answer:', error);
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
      // Add user message to history immediately
      setInterviewHistory(prev => [...prev, userMessage]);

      // Evaluate answer and get result
      const evaluation = await evaluateAnswer(transcript);
      const numericScore = getNumericScore(evaluation.score);

      // Store previous score for next question selection
      setPreviousScore(evaluation.score);

      // Update user message with score
      setInterviewHistory(prev => 
        prev.map((msg, index) => 
          index === prev.length - 1 && msg.role === 'user' 
            ? { ...msg, score: numericScore, feedback: evaluation.feedback }
            : msg
        )
      );

      // Add feedback message
      const feedbackMessage: InterviewMessage = {
        role: 'assistant',
        content: evaluation.feedback,
        timestamp: new Date(),
        type: 'feedback'
      };

      setInterviewHistory(prev => [...prev, feedbackMessage]);
      
      // Speak the feedback
      if (soundEnabled) speakText(evaluation.feedback);

      // Update total score
      setTotalScore(prev => prev + numericScore);
      setQuestionsAnswered(prev => prev + 1);

      // Wait a bit before next question
      setTimeout(() => {
        // Add next question
        const nextQuestionMessage: InterviewMessage = {
          role: 'assistant',
          content: evaluation.nextQuestion,
          timestamp: new Date(),
          type: 'question'
        };

        setInterviewHistory(prev => [...prev, nextQuestionMessage]);
        setCurrentResponse(evaluation.nextQuestion);
        
        // Speak the next question
        if (soundEnabled) speakText(evaluation.nextQuestion);
        
        // Start timer for next question
        startQuestionTimer(evaluation.nextQuestion);
      }, 3000);

    } catch (error) {
      console.error('Error in speech completion:', error);
      // Add error message
      const errorMessage: InterviewMessage = {
        role: 'assistant',
        content: "I appreciate your answer. Let's continue with the next question.",
        timestamp: new Date(),
        type: 'feedback'
      };
      setInterviewHistory(prev => [...prev, errorMessage]);
      if (soundEnabled) speakText("Let's continue with the next question.");
      
      // Still get next question even if evaluation failed
      setTimeout(() => {
        getNextQuestion();
      }, 2000);
    } finally {
      // Reset transcript and clear timer
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
      return { icon: <CheckCircle className="w-4 h-4" />, color: 'text-green-600', text: 'Full Correct' };
    } else if (score === 0.5) {
      return { icon: <HelpCircle className="w-4 h-4" />, color: 'text-yellow-600', text: 'Half Correct' };
    } else {
      return { icon: <XCircle className="w-4 h-4" />, color: 'text-red-600', text: 'Incorrect' };
    }
  };

  // Hydration fix
  if (!hasMounted) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">Loading...</div>;
  }

  if (!browserSupportsSpeechRecognition) {
    return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">Browser not supported</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Voice Interview Practice</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice your interview skills with AI. Get scored on answer correctness and receive detailed feedback.
          </p>
        </div>

        {!showInterview ? (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader><CardTitle>Interview Configuration</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div><input type="text" value={interviewConfig.name} onChange={(e) => setInterviewConfig(prev => ({...prev, name: e.target.value}))} className="w-full p-2 border rounded-md" placeholder="Your Name *" /></div>
                <div><input type="text" value={interviewConfig.jobRole} onChange={(e) => setInterviewConfig(prev => ({...prev, jobRole: e.target.value}))} className="w-full p-2 border rounded-md" placeholder="Job Role *" /></div>
                <div><input type="text" value={interviewConfig.company} onChange={(e) => setInterviewConfig(prev => ({...prev, company: e.target.value}))} className="w-full p-2 border rounded-md" placeholder="Company" /></div>
                <div className="flex gap-2">
                  {[10, 15, 30].map((duration) => (
                    <Button key={duration} variant={interviewConfig.duration === duration ? "default" : "outline"} onClick={() => setInterviewConfig(prev => ({...prev, duration: duration as 10 | 15 | 30}))} className="flex-1">{duration} min</Button>
                  ))}
                </div>
                <Button onClick={startInterview} className="w-full bg-green-600 hover:bg-green-700" size="lg">Start Interview</Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="w-full max-w-6xl mx-auto space-y-6">
            {/* Interview Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🎙️ Interview in Progress</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm"><Clock className="w-4 h-4" /><span>{formatTime(timeRemaining)}</span></div>
                    <div className="flex items-center gap-2 text-sm"><Star className="w-4 h-4 text-yellow-500" /><span>Score: {totalScore.toFixed(1)}/{questionsAnswered}</span></div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={toggleSound} size="sm">
                        {soundEnabled ? <Volume2 className="w-4 h-4 mr-2" /> : <VolumeX className="w-4 h-4 mr-2" />}
                        {soundEnabled ? 'Sound On' : 'Sound Off'}
                      </Button>
                      <Button variant="outline" onClick={downloadTranscript} size="sm"><Download className="w-4 h-4 mr-2" />Transcript</Button>
                      <Button variant="outline" onClick={resetInterview} size="sm"><RotateCcw className="w-4 h-4 mr-2" />Restart</Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg"><strong>Candidate:</strong> {interviewConfig.name}</div>
                  <div className="p-3 bg-blue-50 rounded-lg"><strong>Role:</strong> {interviewConfig.jobRole}</div>
                  <div className="p-3 bg-blue-50 rounded-lg"><strong>Company:</strong> {interviewConfig.company}</div>
                </div>
              </CardContent>
            </Card>

            {/* Interview Completed Feedback */}
            {interviewCompleted && finalFeedback && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader><CardTitle className="text-green-800">Interview Completed! 🎉</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg">
                      <h3 className="font-semibold mb-2">Final Score: {totalScore.toFixed(1)}/{questionsAnswered}</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{finalFeedback}</p>
                    </div>
                    <Button onClick={resetInterview} className="w-full">Start New Interview</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interview Conversation */}
            {!interviewCompleted && (
              <>
                <Card>
                  <CardHeader><CardTitle>Interview Conversation</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-6 max-h-96 overflow-y-auto p-4">
                      {interviewHistory.map((message, index) => (
                        <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-2xl p-4 ${
                            message.role === 'user' 
                              ? 'bg-blue-500 text-white rounded-br-none' 
                              : message.type === 'feedback'
                                ? 'bg-yellow-100 border border-yellow-200 text-yellow-800 rounded-bl-none'
                                : 'bg-gray-100 text-gray-800 rounded-bl-none'
                          }`}>
                            <div className="flex items-start gap-3">
                              {message.role === 'assistant' && (
                                <div className="p-2 bg-gray-200 rounded-full">
                                  <Bot className="w-4 h-4 text-gray-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                  <span className={`font-semibold ${message.role === 'user' ? 'text-blue-100' : 'text-gray-700'}`}>
                                    {message.role === 'user' ? 'You' : 'Interviewer'}
                                  </span>
                                  <span className={`text-xs ${message.role === 'user' ? 'text-blue-200' : 'text-gray-500'}`}>
                                    {message.timestamp.toLocaleTimeString()}
                                  </span>
                                </div>
                                <p className="whitespace-pre-wrap">{message.content}</p>
                                
                                {/* Score Display */}
                                {message.score !== undefined && (
                                  <div className="mt-2 flex items-center gap-2">
                                    {getScoreDisplay(message.score)?.icon}
                                    <span className={`text-sm font-medium ${getScoreDisplay(message.score)?.color}`}>
                                      {getScoreDisplay(message.score)?.text} ({message.score}/1)
                                    </span>
                                  </div>
                                )}
                                
                                {/* Feedback Display */}
                                {message.feedback && (
                                  <div className="mt-2 p-2 bg-white bg-opacity-20 rounded text-sm">
                                    <strong>Feedback:</strong> {message.feedback}
                                  </div>
                                )}
                              </div>
                              {message.role === 'user' && (
                                <div className="p-2 bg-blue-400 rounded-full">
                                  <User className="w-4 h-4 text-white" />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                      <div ref={conversationEndRef} />
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Controls with Timer */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm flex items-center justify-between">
                      <span>Voice Controls</span>
                      {currentQuestionTimer && (
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Clock className="w-4 h-4 text-orange-500" />
                          <span>Time: {formatTime(currentQuestionTimer.timeLeft)}</span>
                        </div>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Textarea
                        value={transcript}
                        readOnly
                        placeholder={listening ? "Speak now... I'm listening" : "Click 'Start Speaking' and begin your answer"}
                        className="min-h-[100px] resize-none"
                      />
                      
                      <div className="flex flex-wrap gap-3 justify-center">
                        <Button
                          onClick={startListening}
                          disabled={listening || isProcessing}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <Mic className="w-4 h-4" />
                          Start Speaking
                        </Button>
                        
                        <Button
                          onClick={stopListening}
                          disabled={!listening || isProcessing}
                          variant="secondary"
                          className="flex items-center gap-2"
                        >
                          <StopCircle className="w-4 h-4" />
                          Send Answer
                        </Button>

                        <Button
                          onClick={handleManualSend}
                          disabled={!transcript.trim() || isProcessing}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          📨 Send Text
                        </Button>

                        <Button
                          onClick={toggleSound}
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                          Sound
                        </Button>
                      </div>

                      {/* Current Question Display */}
                      {currentQuestionTimer && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <div className="text-sm text-orange-800">
                            <strong>Current Question:</strong> {currentQuestionTimer.question}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}