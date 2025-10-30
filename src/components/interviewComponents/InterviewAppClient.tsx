



"use client";

import { useEffect, useRef, useState } from "react";
import {
  Clock,
  Star,
  Volume2,
  VolumeX,
  Download,
  RotateCcw,
  Video,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VoiceChat from "@/components/interviewComponents/VoiceChat";
import Controls from "@/components/interviewComponents/Controls";

interface InterviewConfig {
  name: string;
  jobRole: string;
  company?: string;
  duration: 10 | 15 | 30;
}

interface Props {
  config: InterviewConfig;
  onEnd: () => void;
}

export default function InterviewAppClient({ config, onEnd }: Props) {
  const localVideo = useRef<HTMLVideoElement>(null);
  const [timeRemaining, setTimeRemaining] = useState(config.duration * 60);
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);

  // ✅ Webcam setup
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        activeStream = stream;
        if (localVideo.current) localVideo.current.srcObject = stream;
      })
      .catch(console.error);

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  // ✅ Timer & progress
  useEffect(() => {
    if (!interviewStarted) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onEnd();
          return 0;
        }
        const newTime = prev - 1;
        const progress =
          ((config.duration * 60 - newTime) / (config.duration * 60)) * 100;
        setProgressPercentage(progress);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [interviewStarted, config.duration, onEnd]);

  const handleLeave = () => {
    if (localVideo.current?.srcObject) {
      (localVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
    }
    window.location.href = "/dashboard";
  };

  const toggleSound = () => setSoundEnabled((prev) => !prev);
  const downloadTranscript = () => alert("Transcript downloaded ✅");
  const resetInterview = () => window.location.reload();

  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen  flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8">
        <Card className="border-gray-700  backdrop-blur-md shadow-lg rounded-xl sm:rounded-2xl">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="text-2xl"><Video className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6" /></div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold">
                    AI Live Interview
                  </h2>
                  <p className="text-xs sm:text-sm text-gray-400">
                    Role: {config.jobRole}
                  </p>
                </div>
              </div>

              {/* Timer + Score */}
              <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start">
                <div className="flex items-center gap-2  px-3 py-2 rounded-lg border border-gray-700">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="font-bold text-sm sm:text-base">
                    {formatTime(timeRemaining)}
                  </span>
                </div>
                <div className="flex items-center gap-2  px-3 py-2 rounded-lg border border-gray-700">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="font-bold text-sm sm:text-base">
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
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm mb-4">
              <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] text-center">
                <div className="text-[var(--foreground-secondary)] font-semibold">Candidate</div>
                <div className="text-[var(--foreground)] font-bold truncate">{config.name}</div>
              </div>
              <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] text-center">
                <div className="text-[var(--foreground-secondary)] font-semibold">Role</div>
                <div className="text-[var(--foreground)] font-bold truncate">{config.jobRole}</div>
              </div>
              <div className="p-3 bg-[var(--background-secondary)] rounded-lg border border-[var(--border)] text-center">
                <div className="text-[var(--foreground-secondary)] font-semibold">Company</div>
                <div className="text-[var(--foreground)] font-bold truncate">{config.company || "MockMiya"}</div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 justify-center">
              <Button
                onClick={toggleSound}
                className="bg-primary text-primary-foreground hover:opacity-90 py-2 px-4 rounded-lg text-sm flex items-center gap-2"
              >
                {soundEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
                {soundEnabled ? "Sound On" : "Sound Off"}
              </Button>

              <Button
                onClick={downloadTranscript}
                className="bg-blue-500 text-white hover:bg-blue-600 py-2 px-4 rounded-lg text-sm flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Transcript
              </Button>

              <Button
                onClick={resetInterview}
                className="bg-rose-600 text-white hover:bg-rose-700 py-2 px-4 rounded-lg text-sm flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Restart
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Interview Body */}
      <div className="flex flex-col lg:flex-row w-full max-w-5xl gap-6 mt-8">
        {/* Left: Webcam */}
        <div className="w-full lg:w-1/2 bg-black rounded-xl overflow-hidden relative shadow-lg">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
            ref={localVideo}
          />
          <div className="absolute bottom-3 right-3 bg-gray-900/60 text-white text-xs px-3 py-1 rounded-md">
            You
          </div>
        </div>

        {/* Right: AI Avatar + Voice Chat */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center bg-gray-900/60 rounded-xl p-6 shadow-lg">
          <VoiceChat
            config={config}
            onEnd={() => {
              onEnd();
              setInterviewStarted(false);
            }}
          />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="mt-8">
        <Controls onLeave={handleLeave} />
      </div>
    </div>
  );
}
