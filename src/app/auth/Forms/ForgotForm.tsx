"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  onSubmit: (email: string) => void;
  onBack?: () => void;
};

export default function ForgotForm({ onSubmit, onBack }: Props) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async () => {
    if (!email) {
      setError("Please enter your email");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) return setError(data.error || "Failed to send OTP");

      alert("OTP sent to your email");
      onSubmit(email);
    } catch (err) {
      // console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="flex flex-col space-y-6 w-full max-w-md mx-auto bg-[#0f1412]/90 backdrop-blur-xl border border-green-900/50 p-8 rounded-3xl"
    >
      <h2 className="text-2xl font-bold text-center text-green-200">Forgot Password</h2>
      <p className="text-center text-sm text-green-300">
        Enter your email to receive a one-time code for resetting your password.
      </p>

      <input
        ref={inputRef}
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className={`w-full px-4 py-3 rounded-lg text-green-200 bg-[#1a231f]/90 border ${
          error ? "border-red-500" : "border-green-700"
        } focus:outline-none focus:ring-2 focus:ring-green-500`}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}

      <motion.button
        type="submit"
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        disabled={loading}
        className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] bg-[#132125] border border-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Sending..." : "Send OTP"}
      </motion.button>

      {onBack && (
        <div className="text-center mt-2">
          <button
            type="button"
            onClick={onBack}
            className="text-green-400 hover:underline text-sm"
          >
            Back to Login
          </button>
        </div>
      )}
    </form>
  );
}
