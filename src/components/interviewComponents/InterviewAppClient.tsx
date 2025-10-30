"use client";

import { useEffect, useRef } from "react";
import Controls from "@/components/interviewComponents/Controls";
import VoiceChat from "@/components/interviewComponents/VoiceChat";



interface InterviewConfig {
  name: string
  jobRole: string
  duration: 10 | 15 | 30
}

interface Props {
  config: InterviewConfig
  onEnd: () => void
}

export default function InterviewAppClient({ config, onEnd }: Props) {

  const localVideo = useRef<HTMLVideoElement>(null);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">AI Live Interview</h1>

      <div className="flex w-full max-w-4xl gap-6">
        {/* Left: User */}
        <div className="w-1/2 bg-black flex items-center justify-center rounded-lg">
          <video
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover rounded-lg"
            ref={(video) => {
              if (video && !video.srcObject) {
                navigator.mediaDevices
                  .getUserMedia({ video: true })
                  .then((stream) => (video.srcObject = stream))
                  .catch(console.error);
              }
            }}
          />
        </div>

        {/* Right: AI Avatar */}
        <div className="w-1/2 flex flex-col items-center gap-4">


          <VoiceChat config={config} onEnd={onEnd} />

        </div>
      </div>

      <Controls onLeave={handleLeave} />
    </div>
  );
}