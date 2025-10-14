// LoginBlocked.tsx
'use client';

import React, { useEffect, useState } from "react";

interface Props {
  email: string;
  blockedUntil: number; // timestamp in ms
}

export default function LoginBlocked({ email, blockedUntil }: Props) {
  const [timeLeft, setTimeLeft] = useState(blockedUntil - Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(blockedUntil - Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, [blockedUntil]);

  if (timeLeft <= 0) return null;

  const seconds = Math.ceil(timeLeft / 1000);

  return (
    <div className="bg-red-600 text-white p-4 rounded-md text-center mb-4">
      Too many failed login attempts for <strong>{email}</strong>. Please try again in <strong>{seconds}s</strong>.
    </div>
  );
}
