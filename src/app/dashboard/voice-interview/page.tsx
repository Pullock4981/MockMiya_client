'use client';

import React, { useState, useEffect, useRef } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mic, StopCircle, RotateCcw, Play, Pause, Download, User, Bot, Clock, Star, CheckCircle, XCircle } from 'lucide-react';

interface InterviewMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  score?: number;
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
  timeLimit: number; // in seconds
  answered: boolean;
  score: number;
}

export default function VoiceInterviewPage() {
  const [hasMounted, setHasMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [interviewHistory, setInterviewHistory] = useState<InterviewMessage[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
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
  
  const synthesisRef = useRef<SpeechSynthesisUtterance | null>(null);
  const interviewTimerRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

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
    setTimeRemaining(duration * 60); // Convert minutes to seconds
    
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

  // Start question timer
  const startQuestionTimer = (question: string) => {
    const timeLimit = 90; // 1.5 minutes in seconds
    setCurrentQuestionTimer({
      question,
      startTime: new Date(),
      timeLimit,
      answered: false,
      score: 10 // Start with full score
    });

    let timeLeft = timeLimit;
    
    questionTimerRef.current = setInterval(() => {
      timeLeft -= 1;
      
      // Reduce score as time passes
      if (timeLeft <= 0) {
        if (questionTimerRef.current) {
          clearInterval(questionTimerRef.current);
        }
        // Auto-submit with penalty
        handleAutoSubmit();
      } else if (timeLeft <= 30) {
        // Apply penalty for late answers
        const penalty = Math.floor((30 - timeLeft) / 5); // Lose 1 point every 5 seconds after 1 minute
        setCurrentQuestionTimer(prev => prev ? {
          ...prev,
          score: Math.max(1, 10 - penalty)
        } : null);
      }
    }, 1000);
  };

  const handleAutoSubmit = async () => {
    if (transcript.trim()) {
      await handleUserSpeechComplete();
    } else {
      // No answer provided - apply maximum penalty
      setCurrentQuestionTimer(prev => prev ? {
        ...prev,
        answered: true,
        score: 0
      } : null);
      
      const penaltyMessage: InterviewMessage = {
        role: 'assistant',
        content: "Time's up! Unfortunately, you didn't provide an answer to this question. Let's move to the next one.",
        timestamp: new Date()
      };
      
      setInterviewHistory(prev => [...prev, penaltyMessage]);
      speakText(penaltyMessage.content);
      
      // Get next question after penalty
      setTimeout(() => {
        getNextQuestion();
      }, 2000);
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
          getQuestion: true
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
        timestamp: new Date()
      };

      setInterviewHistory(prev => [...prev, questionMessage]);
      setCurrentResponse(question);
      speakText(question);

      // Start timer for this question
      startQuestionTimer(question);

    } catch (error) {
      console.error('Error getting question:', error);
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

    } catch (error) {
      console.error('Error getting feedback:', error);
    }
  };

  // Call Gemini API for interview response
  const callGeminiInterviewAPI = async (userMessage: string, history: InterviewMessage[]) => {
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
          conversationHistory: history.map(msg => 
            `${msg.role === 'user' ? 'Candidate' : 'Interviewer'}: ${msg.content}`
          ).join('\n'),
          lastUserMessage: userMessage,
          evaluateAnswer: true
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from interview API');
      }

      const data = await response.json();
      return data.text;

    } catch (error) {
      console.error('Error calling interview API:', error);
      return "I appreciate your answer. Let's move to the next question.";
    } finally {
      setIsProcessing(false);
    }
  };

  // Text-to-Speech function
  const speakText = (text: string) => {
    if (!hasMounted || !window.speechSynthesis) return;

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

  // Handle user speech completion
  const handleUserSpeechComplete = async () => {
    if (!transcript.trim()) return;

    // Calculate score for this question
    const questionScore = currentQuestionTimer?.score || 0;
    setTotalScore(prev => prev + questionScore);
    setQuestionsAnswered(prev => prev + 1);

    const userMessage: InterviewMessage = {
      role: 'user',
      content: transcript,
      timestamp: new Date(),
      score: questionScore
    };

    // Add user message to history
    const updatedHistory = [...interviewHistory, userMessage];
    setInterviewHistory(updatedHistory);

    // Get AI response
    const aiResponse = await callGeminiInterviewAPI(transcript, updatedHistory);
    
    const assistantMessage: InterviewMessage = {
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    // Update history with AI response
    setInterviewHistory(prev => [...prev, assistantMessage]);
    setCurrentResponse(aiResponse);

    // Speak the AI response
    speakText(aiResponse);

    // Reset transcript for next input
    resetTranscript();

    // Clear question timer
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
    }
    setCurrentQuestionTimer(null);

    // Get next question after a delay
    setTimeout(() => {
      getNextQuestion();
    }, 3000);
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
      `${msg.role === 'user' ? 'CANDIDATE' : 'INTERVIEWER'} (${msg.timestamp.toLocaleTimeString()})${msg.score ? ` [Score: ${msg.score}/10]` : ''}:\n${msg.content}\n\n`
    ).join('---\n\n') + 
    `\n\nFINAL SCORE: ${totalScore}/${questionsAnswered * 10}\nFEEDBACK:\n${finalFeedback}`;

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

  // Hydration fix
  if (!hasMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Voice Interview Practice
            </h1>
          </div>
          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6 text-center">
              <div className="text-lg">Loading Voice Interview...</div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!browserSupportsSpeechRecognition) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              AI Voice Interview Practice
            </h1>
          </div>
          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="text-red-500 text-center">
                🚨 Browser not supported for speech recognition. Please use Chrome, Edge, or Safari.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Voice Interview Practice
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice your interview skills with AI. Get scored on your responses and receive detailed feedback.
          </p>
        </div>

        {!showInterview ? (
          // Configuration Form
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Interview Configuration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Your Name *</label>
                  <input
                    type="text"
                    value={interviewConfig.name}
                    onChange={(e) => setInterviewConfig(prev => ({...prev, name: e.target.value}))}
                    className="w-full p-2 border rounded-md"
                    placeholder="Enter your name"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Job Role *</label>
                  <input
                    type="text"
                    value={interviewConfig.jobRole}
                    onChange={(e) => setInterviewConfig(prev => ({...prev, jobRole: e.target.value}))}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Frontend Developer, Data Scientist"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Company</label>
                  <input
                    type="text"
                    value={interviewConfig.company}
                    onChange={(e) => setInterviewConfig(prev => ({...prev, company: e.target.value}))}
                    className="w-full p-2 border rounded-md"
                    placeholder="e.g., Google, Amazon, Startup"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium block mb-2">Interview Duration</label>
                  <div className="flex gap-2">
                    {[10, 15, 30].map((duration) => (
                      <Button
                        key={duration}
                        variant={interviewConfig.duration === duration ? "default" : "outline"}
                        onClick={() => setInterviewConfig(prev => ({...prev, duration: duration as 10 | 15 | 30}))}
                        className="flex-1"
                      >
                        {duration} min
                      </Button>
                    ))}
                  </div>
                </div>
                <Button
                  onClick={startInterview}
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  Start Interview
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          // Interview Interface
          <div className="w-full max-w-4xl mx-auto space-y-6">
            {/* Interview Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>🎙️ Interview in Progress</span>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(timeRemaining)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>Score: {totalScore}/{questionsAnswered * 10 || 0}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={downloadTranscript} size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Transcript
                      </Button>
                      <Button variant="outline" onClick={resetInterview} size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Restart
                      </Button>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <strong>Candidate:</strong> {interviewConfig.name}
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <strong>Role:</strong> {interviewConfig.jobRole}
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <strong>Company:</strong> {interviewConfig.company}
                  </div>
                </div>

                {/* Current Question Timer */}
                {currentQuestionTimer && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Current Question Timer:</span>
                      <div className="flex items-center gap-2">
                        {currentQuestionTimer.score > 7 ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : currentQuestionTimer.score > 3 ? (
                          <Clock className="w-4 h-4 text-yellow-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span>Score: {currentQuestionTimer.score}/10</span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interview Completed Feedback */}
            {interviewCompleted && finalFeedback && (
              <Card className="bg-green-50 border-green-200">
                <CardHeader>
                  <CardTitle className="text-green-800">Interview Completed! 🎉</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-lg">
                      <h3 className="font-semibold mb-2">Final Score: {totalScore}/{questionsAnswered * 10}</h3>
                      <p className="text-gray-700 whitespace-pre-wrap">{finalFeedback}</p>
                    </div>
                    <Button onClick={resetInterview} className="w-full">
                      Start New Interview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Interview Conversation */}
            {!interviewCompleted && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Interview Conversation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 max-h-96 overflow-y-auto p-2">
                      {interviewHistory.map((message, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            message.role === 'user'
                              ? 'bg-blue-50 border border-blue-200'
                              : 'bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-full ${
                              message.role === 'user' ? 'bg-blue-100' : 'bg-gray-100'
                            }`}>
                              {message.role === 'user' ? 
                                <User className="w-4 h-4 text-blue-600" /> : 
                                <Bot className="w-4 h-4 text-gray-600" />
                              }
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between items-start mb-2">
                                <span className={`font-semibold ${
                                  message.role === 'user' ? 'text-blue-700' : 'text-gray-700'
                                }`}>
                                  {message.role === 'user' ? 'You' : 'Interviewer'}
                                  {message.score !== undefined && (
                                    <span className={`ml-2 text-xs ${
                                      message.score >= 7 ? 'text-green-600' : 
                                      message.score >= 4 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                      [{message.score}/10]
                                    </span>
                                  )}
                                </span>
                                <span className="text-xs text-gray-500">
                                  {message.timestamp.toLocaleTimeString()}
                                </span>
                              </div>
                              <p className="text-gray-700 whitespace-pre-wrap">{message.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Controls */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Voice Controls</CardTitle>
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
                      </div>
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