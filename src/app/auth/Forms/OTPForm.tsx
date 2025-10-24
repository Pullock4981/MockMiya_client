'use client';

import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

type Props = {
  email: string;
  onVerified: (otp: string) => void;
  onResend?: () => void;
};

type VerifyOtpResponse = {
  message?: string;
  error?: string;
  success?: boolean;
};

export default function OTPForm({ email, onVerified, onResend }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, "");
    if (!val) return;

    const newOtp = [...otp];
    newOtp[idx] = val[0];
    setOtp(newOtp);

    if (idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];
      if (otp[idx]) {
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        newOtp[idx - 1] = "";
        setOtp(newOtp);
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").replace(/\D/g, "");
    if (pasteData.length === 6) {
      setOtp(pasteData.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) return alert("Please enter 6-digit OTP");

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: code }),
      });

      const data: VerifyOtpResponse = await res.json();
      console.log("OTP verify response:", data);

      if (!res.ok) return alert(data.error || "OTP verification failed");
      if (data.success) {
        onVerified(code); // ✅ OTP passed to parent
      } else {
        alert(data.error || "OTP verification failed");
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error");
      alert(`Server error during OTP verification: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="flex flex-col space-y-6 w-full max-w-md mx-auto bg-[#0f1412]/90 backdrop-blur-xl border border-green-900/50 p-8 rounded-3xl"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold text-center text-green-200">Verify Your Email</h2>
      <p className="text-center text-sm text-green-300">
        Code sent to <b>{email}</b>
      </p>

      <div className="flex justify-between gap-2" onPaste={handlePaste}>
        {otp.map((val, idx) => (
          <input
            key={idx}
            ref={(el) => { inputRefs.current[idx] = el; }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={val || ""}
            onChange={(e) => handleChange(e, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-12 h-12 text-center border rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-[#1a231f]/90 text-green-200"
          />
        ))}
      </div>

      <motion.input
        type="submit"
        value={loading ? "Verifying..." : "Verify"}
        disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      />

      {onResend && (
        <p className="text-sm text-center text-green-300">
          Didn’t receive code?{" "}
          <button type="button" className="text-blue-500 underline" onClick={onResend}>
            Resend OTP
          </button>
        </p>
      )}
    </form>
  );
}
