"use client";
import React, { useState, useRef, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { motion } from "framer-motion";

type Props = {
  email: string;
  onResetSuccess: () => void;
  onBack?: () => void;
};

export default function ResetPasswordForm({ email, onResetSuccess, onBack }: Props) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});

  const passwordRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    passwordRef.current?.focus();
  }, []);

  const validate = () => {
    const newErrors: { password?: string; confirm?: string } = {};
    if (!password || password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (password !== confirm) newErrors.confirm = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);

    // 🔹 Debug log: what we are sending
    // console.log("🔹 ResetPasswordForm submitting:", { email, newPassword: password.trim() });

    try {
      const res = await fetch("/api/reset-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newPassword: password.trim() }), // no OTP sent
      });

      // console.log("🔹 Raw response status:", res.status);

      const data = await res.json();
      // console.log("🔹 ResetPasswordForm response:", data);

      if (!res.ok) return alert(data.error || "Failed to reset password");

      alert("Password reset successfully!");
      onResetSuccess();
    } catch (err) {
      console.error("🔹 ResetPasswordForm catch error:", err);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col space-y-6 w-full max-w-md mx-auto bg-[#0f1412]/90 backdrop-blur-xl border border-green-900/50 p-8 rounded-3xl"
    >
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-green-300 hover:text-green-100 font-semibold mb-2"
        >
          <ChevronLeft size={18} /> Back
        </button>
      )}

      <h2 className="text-2xl font-bold text-center text-green-200">Reset Password</h2>
      <p className="text-center text-sm text-green-300">
        Enter your new password for <b>{email}</b>
      </p>

      {/* New Password */}
      <div className="relative">
        <input
          ref={passwordRef}
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="New Password"
          className={`w-full px-4 py-3 rounded-lg text-green-200 bg-[#1a231f]/90 border ${
            errors.password ? "border-red-500" : "border-green-700"
          } focus:outline-none focus:ring-2 focus:ring-green-500`}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-200"
        >
          {showPassword ? "Hide" : "Show"}
        </button>
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Confirm Password"
          className={`w-full px-4 py-3 rounded-lg text-green-200 bg-[#1a231f]/90 border ${
            errors.confirm ? "border-red-500" : "border-green-700"
          } focus:outline-none focus:ring-2 focus:ring-green-500`}
        />
        <button
          type="button"
          onClick={() => setShowConfirm((prev) => !prev)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 hover:text-green-200"
        >
          {showConfirm ? "Hide" : "Show"}
        </button>
        {errors.confirm && <p className="text-red-500 text-sm mt-1">{errors.confirm}</p>}
      </div>

      <motion.button
        type="submit"
        whileHover={{ scale: loading ? 1 : 1.03 }}
        whileTap={{ scale: loading ? 1 : 0.97 }}
        disabled={loading}
        className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] bg-[#132125] border border-green-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Resetting..." : "Reset Password"}
      </motion.button>
    </form>
  );
}
