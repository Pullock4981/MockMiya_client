// LoginBlocked.tsx
'use client';

import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";

interface Props {
  email: string;
  blockedUntil: number;
  onUnlock?: () => void;
  lockDuration?: number;
}

export default function LoginBlocked({ email, blockedUntil, onUnlock, lockDuration = 2*60*1000 }: Props) {
  const [timeLeft, setTimeLeft] = useState(blockedUntil ? blockedUntil - Date.now() : 0);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      const remaining = blockedUntil - Date.now();
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        if (onUnlock) onUnlock();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [blockedUntil, onUnlock, timeLeft]);

  const formattedTime = useMemo(() => {
    const totalSeconds = Math.max(0, Math.floor(timeLeft / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }, [timeLeft]);

  const progressPercent = Math.max(0, (timeLeft / lockDuration) * 100);

  if (timeLeft <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-green-900/20 text-green-400 border border-green-700 p-4 rounded-xl text-center mb-4"
      >
        <p className="text-sm font-medium">✅ You can now try logging in again.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className="bg-gradient-to-r from-red-600 to-red-500 text-white p-5 rounded-2xl text-center mb-4 shadow-lg border border-red-700"
    >
      <h2 className="font-semibold text-lg mb-1 flex justify-center items-center gap-2">
        🚫 Login Temporarily Locked
      </h2>

      <p className="text-sm">
        Too many failed login attempts for <strong className="underline">{email}</strong>.
      </p>

      <p className="mt-2 text-base font-medium text-yellow-200">
        You can try again in <strong>{formattedTime}</strong>.
      </p>

      <div className="relative w-full bg-red-800 h-2 mt-4 rounded-full overflow-hidden">
        <motion.div
          className="absolute top-0 left-0 h-full bg-yellow-400"
          initial={{ width: "100%" }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ ease: "linear", duration: 1 }}
        />
      </div>
    </motion.div>
  );
}
