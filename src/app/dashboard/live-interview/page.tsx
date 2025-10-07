
"use client";

import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { AiAvatar } from "@/components/interviewComponents/AiAvatar";
import { AudioRecorder, blobToBase64 } from "@/utils/audioRecorder";
import Controls from "@/components/interviewComponents/Controls";

type InterviewState = "idle" | "listening" | "thinking" | "speaking";

export default function LiveInterview() {
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [interviewState, setInterviewState] = useState<InterviewState>("idle");
  const audioRecorderRef = useRef(new AudioRecorder());
  const localVideo = useRef<HTMLVideoElement>(null);

  // ✅ Start interview
  const startInterview = async () => {
    setIsInterviewActive(true);
    setInterviewState("speaking");
    await speakAI(
      "Hello! I'm your AI interviewer. Let's start with a simple question. Can you tell me about yourself?"
    );
  };

  // ✅ AI speaks with voice
  const speakAI = async (text: string) => {
    setInterviewState("speaking");
    return new Promise<void>((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onend = () => {
        setInterviewState("listening");
        resolve();
      };
      speechSynthesis.speak(utterance);
    });
  };

  // ✅ Start user voice recording
  const startListening = async () => {
    try {
      setInterviewState("listening");
      await audioRecorderRef.current.start();
    } catch (err) {
      alert(`Error accessing microphone: ${err}`);
    }
  };

  // ✅ Stop user recording and trigger AI response
  const stopListening = async () => {
    try {
      const blob = await audioRecorderRef.current.stop();
      setInterviewState("thinking");

      // small delay to simulate AI thinking
      await new Promise((res) => setTimeout(res, 1000));

      const base64Audio = await blobToBase64(blob);
      console.log("Recorded audio:", base64Audio); // ✅ prevents unused warning

      // Simulated AI response
      const responses = [
        "That's interesting! Can you tell me more about your experience with teamwork?",
        "Great answer! Now, what are your biggest strengths?",
        "I see. How do you handle challenging situations at work?",
        "Excellent! What motivates you in your career?",
      ];
      const randomResponse =
        responses[Math.floor(Math.random() * responses.length)];

      await speakAI(randomResponse);
    } catch (err) {
      alert(`Error stopping recording: ${err}`);
      setInterviewState("listening");
    }
  };

  // ✅ End interview
  const endInterview = () => {
    setIsInterviewActive(false);
    setInterviewState("idle");
    speechSynthesis.cancel();
    if (audioRecorderRef.current.isRecording()) audioRecorderRef.current.stop();
  };

  // ✅ Setup webcam preview
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        activeStream = stream;
        if (localVideo.current) localVideo.current.srcObject = stream;
      })
      .catch(console.error);

    // ✅ Cleanup safely
    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  // ✅ Leave interview
  const handleLeave = () => {
    if (localVideo.current?.srcObject) {
      (localVideo.current.srcObject as MediaStream)
        .getTracks()
        .forEach((t) => t.stop());
    }
    window.location.href = "/dashboard";
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-3xl font-bold mb-6">AI Live Interview</h1>

      <div className="flex w-full max-w-4xl gap-6">
        {/* Left: User Video */}
        <div className="w-1/2 bg-black flex items-center justify-center rounded-lg">
          <video
            autoPlay
            muted
            playsInline
            ref={localVideo}
            className="w-full h-full object-cover rounded-lg"
          />
        </div>

        {/* Right: AI Avatar */}
        <div className="w-1/2 flex flex-col items-center gap-4">
          <AiAvatar state={interviewState} />

          {!isInterviewActive ? (
            <button
              onClick={startInterview}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Start Interview
            </button>
          ) : (
            <div className="flex gap-4">
              <button
                onClick={
                  audioRecorderRef.current.isRecording()
                    ? stopListening
                    : startListening
                }
                className={`px-4 py-2 rounded ${
                  audioRecorderRef.current.isRecording()
                    ? "bg-red-500 text-white"
                    : "bg-green-600 text-white"
                }`}
              >
                {audioRecorderRef.current.isRecording() ? (
                  <>
                    <MicOff className="inline mr-2" /> Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="inline mr-2" /> Start Recording
                  </>
                )}
              </button>

              <button
                onClick={endInterview}
                className="px-4 py-2 rounded bg-gray-500 text-white hover:bg-gray-600"
              >
                End Interview
              </button>
            </div>
          )}
        </div>
      </div>

      <Controls onLeave={handleLeave} />
    </div>
  );
}
