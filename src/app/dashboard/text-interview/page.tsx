'use client';

import React, { useState, useEffect } from "react";
import { LoadingSpinner } from "../components/Loading";

type Role = {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
};

type InterviewType = "behavioral" | "technical" | "situational" | "mixed";

interface Evaluation {
  score: number;
  feedback: string;
}

const ROLES: Role[] = [
  { id: "se", title: "Software Engineer", subtitle: "Technical coding, system design, and problem-solving questions", icon: "💻" },
  { id: "pm", title: "Product Manager", subtitle: "Product strategy, stakeholder management, and metrics-driven decisions", icon: "📊" },
  { id: "ds", title: "Data Scientist", subtitle: "Statistical analysis, machine learning, and data interpretation", icon: "🔬" },
  { id: "mm", title: "Marketing Manager", subtitle: "Campaign strategy, brand management, and customer acquisition", icon: "🎯" },
  { id: "sr", title: "Sales Representative", subtitle: "Customer relations, negotiation, and revenue generation", icon: "🤝" },
  { id: "ux", title: "UX Designer", subtitle: "User research, design thinking, and interface optimization", icon: "🎨" },
];

// Helper function to format interview type
function formatInterviewType(type: InterviewType | null): string {
  if (!type) return 'Interview';
  return type.charAt(0).toUpperCase() + type.slice(1) + ' Interview';
}

export default function TextInterview() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [interviewType, setInterviewType] = useState<InterviewType | null>(null);
  const [inInterview, setInInterview] = useState(false);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [localAnswer, setLocalAnswer] = useState("");
  const [time, setTime] = useState(0);
  const [loading, setLoading] = useState(false);
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null);
  const [completed, setCompleted] = useState(false);

  // Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    if (inInterview) {
      timer = setInterval(() => setTime((t) => t + 1), 1000);
    }
    return () => timer && clearInterval(timer);
  }, [inInterview]);

  // Start interview
  async function startInterview(type: InterviewType) {
    if (!selectedRole) return;
    setInterviewType(type);
    setInInterview(true);
    setTime(0);
    setCompleted(false);
    setAnswers([]);
    setQuestions([]);
    setCurrentIndex(0);
    setLoading(true);

    try {
      const res = await fetch("/api/generate/text-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "generateQuestions", topic: selectedRole.title }),
      });
      const data = await res.json();
      const qs: string[] = data.questions ?? [];
      setQuestions(qs.slice(0, 5));
      setAnswers(Array(5).fill(""));
    } catch {
      setQuestions(Array.from({ length: 5 }, (_, i) => `Question ${i + 1}`));
      setAnswers(Array(5).fill(""));
    } finally {
      setLoading(false);
    }
  }

  function saveCurrentAnswer() {
    const copy = [...answers];
    copy[currentIndex] = localAnswer;
    setAnswers(copy);
  }

  function goPrevious() {
    if (currentIndex === 0) return;
    saveCurrentAnswer();
    setLocalAnswer(answers[currentIndex - 1] ?? "");
    setCurrentIndex((i) => i - 1);
  }

  async function goNextOrFinish() {
    const copy = [...answers];
    copy[currentIndex] = localAnswer;
    setAnswers(copy);
    setLocalAnswer("");

    if (currentIndex < 4) {
      setCurrentIndex((i) => i + 1);
      setLocalAnswer(copy[currentIndex + 1] ?? "");
    } else {
      await finishInterview(copy);
    }
  }

  async function finishInterview(finalAnswers: string[]) {
    setLoading(true);
    setCompleted(true);
    try {
      const res = await fetch("/api/generate/text-interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "evaluateSession",
          questions,
          answers: finalAnswers,
        }),
      });
      const data = await res.json();
      setEvaluation(data.evaluation ?? { score: 0, feedback: "No evaluation returned." });
    } catch {
      setEvaluation({ score: 0, feedback: "Evaluation failed." });
    } finally {
      setLoading(false);
      setInInterview(false);
    }
  }

  const RoleCard: React.FC<{ role: Role }> = ({ role }) => (
    <div
      className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-[var(--primary)] cursor-pointer overflow-hidden shadow-lg"
      onClick={() => setSelectedRole(role)}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative z-10 flex items-start gap-3 sm:gap-4">
        <div className="text-2xl transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
          {role.icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-[var(--card-foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
            {role.title}
          </h3>
          <p className="text-sm text-[var(--foreground-muted)] mt-2 leading-relaxed line-clamp-2">
            {role.subtitle}
          </p>
          <button className="mt-4 sm:mt-5 bg-[var(--primary)] text-[var(--primary-foreground)] px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-sm font-medium hover:shadow-lg transition-all group-hover:scale-105 w-full sm:w-auto">
            Select Role
          </button>
        </div>
      </div>
    </div>
  );

  // Step 1: Choose role
  if (!selectedRole) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 mb-4 sm:mb-6">
              <span className="text-2xl sm:text-3xl">🎯</span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mt-1">Choose Your Role</h1>
            </div>

            <p className="text-sm sm:text-base lg:text-lg text-[var(--foreground-muted)] max-w-2xl mx-auto px-4">
              Select the position you want to practice interviewing for. Each role has tailored questions to help you excel.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {ROLES.map((r) => (
              <RoleCard key={r.id} role={r} />
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Step 2: Choose interview type
  if (!inInterview && !completed) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => setSelectedRole(null)}
            className="mb-10 sm:mb-16 text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] font-medium flex items-center gap-2 transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            Back to Role Selection
          </button>

          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-[var(--card-foreground)] mb-2">Select Interview Type</h2>
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-[var(--card)] border border-[var(--border)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full shadow-sm max-w-full">
              <span className="text-[var(--primary)] text-sm sm:text-base">🎯</span>
              <span className="text-xs sm:text-sm text-[var(--foreground-muted)] truncate">
                Selected: <span className="font-semibold text-[var(--primary)]">{selectedRole.title}</span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              {
                type: "behavioral",
                emoji: "👤",
                title: "Behavioral Interview",
                desc: "Questions about past experiences, leadership, and teamwork",
                gradient: "from-green-400 to-emerald-500"
              },
              {
                type: "technical",
                emoji: "⚡",
                title: "Technical Interview",
                desc: "Role-specific technical skills and knowledge assessment",
                gradient: "from-blue-400 to-cyan-500"
              },
              {
                type: "situational",
                emoji: "🎯",
                title: "Situational Interview",
                desc: "Hypothetical scenarios and problem-solving approaches",
                gradient: "from-purple-400 to-indigo-500"
              },
              {
                type: "mixed",
                emoji: "🔀",
                title: "Mixed Interview",
                desc: "Combination of all interview types",
                gradient: "from-orange-400 to-red-500"
              },
            ].map(({ type, emoji, title, desc, gradient }) => (
              <div
                key={type}
                className="group relative bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-[var(--primary)] cursor-pointer overflow-hidden shadow-lg"
                onClick={() => startInterview(type as InterviewType)}
              >
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />

                <div className="relative z-10 flex items-start gap-3 sm:gap-4 h-20">
                  <div className={`text-xl sm:text-2xl p-2 sm:p-3 rounded-xl bg-gradient-to-r ${gradient} text-white transform group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}>
                    {emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--card-foreground)] text-base sm:text-lg mb-1 sm:mb-2 truncate">
                      {title}
                    </h3>
                    <p className="text-[var(--foreground-muted)] text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {desc}
                    </p>
                  </div>
                </div>
                <div className="relative z-10 mt-4 sm:mt-6 w-full bg-[var(--primary)] text-[var(--primary-foreground)] py-2 sm:py-3 rounded-xl font-medium text-center group-hover:shadow-lg transition-all group-hover:scale-105 text-sm sm:text-base">
                  Start Interview
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Step 3: Q&A
  if (inInterview && questions.length > 0 && !completed) {
    const question = questions[currentIndex] ?? `Question ${currentIndex + 1}`;
    const MAX_CHARS = 1000;
    const progress = ((currentIndex + 1) / 5) * 100;

    return (
      <main className="min-h-screen bg-[var(--background)] p-3 sm:p-4 lg:p-8 transition-colors duration-300">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-6 sm:mb-8">
            <button
              onClick={() => setInInterview(false)}
              className="text-sm text-[var(--foreground-muted)] hover:text-[var(--primary)] font-medium flex items-center gap-2 transition-colors group order-2 sm:order-1"
            >
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              End Interview
            </button>
            <div className="flex items-center gap-3 order-1 sm:order-2 w-full sm:w-auto justify-between sm:justify-normal">
              <div className="text-xs sm:text-sm text-[var(--foreground-muted)] font-medium bg-[var(--card)] border border-[var(--border)] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
                ⏱️ {Math.floor(time / 60)}:{String(time % 60).padStart(2, "0")}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[var(--background-tertiary)] rounded-full h-1.5 sm:h-2 mb-6 sm:mb-8 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Interview Info */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center gap-2 bg-[var(--card)] border border-[var(--border)] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full mb-3 sm:mb-4 max-w-full">
              <span className="text-[var(--primary)] text-sm sm:text-base">🎯</span>
              <span className="text-xs sm:text-sm font-medium text-[var(--foreground-muted)] truncate">
                {formatInterviewType(interviewType)} • {selectedRole.title}
              </span>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 lg:p-8 shadow-lg mb-4 sm:mb-6 transition-all duration-300">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm font-semibold text-[var(--primary)] bg-[var(--primary)]/10 px-2 sm:px-3 py-1 rounded-full">
                Question {currentIndex + 1} of 5
              </span>
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[var(--primary)] rounded-full flex items-center justify-center text-[var(--primary-foreground)] text-xs sm:text-sm font-bold">
                {currentIndex + 1}
              </div>
            </div>
            <h2 className="text-lg sm:text-xl font-semibold text-[var(--card-foreground)] leading-relaxed">
              {question}
            </h2>
          </div>

          {/* Answer Area */}
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300">
            <textarea
              value={localAnswer}
              onChange={(e) => {
                if (e.target.value.length <= MAX_CHARS) setLocalAnswer(e.target.value);
              }}
              className="w-full h-32 sm:h-48 border border-[var(--border)] bg-[var(--background)] rounded-xl p-3 sm:p-4 text-[var(--foreground)] placeholder-[var(--foreground-muted)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20 focus:border-[var(--primary)] transition-all text-sm sm:text-base"
              placeholder="Type your answer here... Be specific and provide examples from your experience."
            />
            <div className="flex justify-between items-center mt-3 sm:mt-4">
              <span className={`text-xs sm:text-sm ${localAnswer.length === MAX_CHARS ? 'text-[var(--destructive)]' : 'text-[var(--foreground-muted)]'}`}>
                {localAnswer.length}/{MAX_CHARS} characters
              </span>
            </div>

            {/* Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3 sm:gap-0 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[var(--border)]">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 order-2 sm:order-1">
                <button
                  onClick={goPrevious}
                  disabled={currentIndex === 0}
                  className="border border-[var(--border)] bg-[var(--background)] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-[var(--foreground)] hover:shadow-lg hover:bg-[var(--background-secondary)] disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 text-sm sm:text-base flex-1"
                >
                  ← Previous
                </button>
                <button
                  onClick={goNextOrFinish}
                  disabled={!localAnswer.trim() || loading}
                  className="bg-[var(--primary)] text-[var(--primary-foreground)] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 text-sm sm:text-base flex-1 whitespace-nowrap"
                >
                  {currentIndex === 4 ? (
                    loading ? "Finishing..." : "Finish Interview"
                  ) : (
                    <span className="flex items-center justify-center gap-1">
                      Next Question <span className="hidden xs:inline">→</span>
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => {
                  setInInterview(false);
                  setQuestions([]);
                  setLocalAnswer("");
                  setAnswers([]);
                }}
                className="border border-[var(--destructive)] text-[var(--destructive)] bg-[var(--destructive)]/10 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium hover:bg-[var(--destructive)]/20 hover:shadow-lg transition-all hover:scale-105 active:scale-95 text-sm sm:text-base order-1 sm:order-2"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Step 4: Evaluation
  if (completed && evaluation) {
    const scoreColor = evaluation.score >= 80 ? 'from-[var(--success)] to-emerald-500' :
      evaluation.score >= 60 ? 'from-[var(--warning)] to-amber-500' :
        'from-[var(--destructive)] to-red-500';

    return (
      <main className="min-h-screen bg-[var(--background)] p-4 sm:p-6 lg:p-8 flex items-center justify-center transition-colors duration-300">
        <div className="max-w-5xl w-full text-center rounded-2xl p-4 sm:p-6 lg:p-8 border-[var(--border)] bg-[var(--card)] shadow-lg">
          {/* Celebration */}
          <div className="animate-bounce text-6xl sm:text-7xl lg:text-8xl mb-4 sm:mb-6">
            🎉
          </div>

          <h2 className="text-2xl sm:text-4xl font-bold text-[var(--card-foreground)] mb-3 sm:mb-4">
            Interview Complete!
          </h2>

          <p className="text-[var(--foreground-muted)] mb-6 sm:mb-8 text-base sm:text-lg px-2">
            Great job completing the {interviewType} interview for {selectedRole.title}
          </p>

          {/* Score Circle */}
          <div className="relative inline-flex items-center justify-center mb-6 sm:mb-8">
            <div className="relative">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[var(--background-tertiary)] flex items-center justify-center">
                <div className={`w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-r ${scoreColor} flex items-center justify-center shadow-lg`}>
                  <span className="text-xl sm:text-2xl font-bold text-white">{evaluation.score}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Feedback */}
          <div className="bg-[var(--background-secondary)] border border-[var(--border)] rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 text-left">
            <h3 className="font-semibold text-[var(--card-foreground)] mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
              📝 Feedback
            </h3>
            <p className="text-[var(--foreground)] leading-relaxed text-sm sm:text-base">
              {evaluation.feedback}
            </p>
          </div>

          <button
            onClick={() => {
              setSelectedRole(null);
              setInInterview(false);
              setCompleted(false);
              setEvaluation(null);
            }}
            className="bg-[var(--primary)] text-[var(--primary-foreground)] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl font-semibold hover:shadow-xl transition-all hover:scale-105 active:scale-95 text-sm sm:text-base w-full sm:w-auto"
          >
            Practice Another Interview
          </button>
        </div>
      </main>
    );
  }

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
