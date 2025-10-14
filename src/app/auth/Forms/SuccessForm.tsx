"use client";
import React, { useEffect } from "react";
import confetti from "canvas-confetti";

export default function SuccessForm() {
  useEffect(() => {
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="space-y-6 bg-muted/30 p-8 rounded-xl shadow-xl flex flex-col w-mdanimate-fade-in">
      <p className="text-sm text-center">🎉 Login Successful! 🎉</p>

{/* redirect to dashboard page or his private route where he try to go before login*/}
    </div>
  );
}
