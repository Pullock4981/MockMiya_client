
'use client';

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import OTPForm from "./Forms/OTPForm";

type Props = { onGoLogin?: () => void };
type SignupFormData = { name: string; email: string; password: string; confirmPassword: string };

// Validation schema
const signupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupForm({ onGoLogin }: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState("");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  const inputClass = "peer w-full rounded-xl bg-[#1a231f]/90 px-4 pt-5 pb-2 text-green-200 outline-none transition-all duration-300 border border-green-800/50";

  // Step 1: Signup API call
  const onSubmit = async (data: SignupFormData) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: data.name, email: data.email, password: data.password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Signup failed");

      setEmailForOTP(data.email);
      setOtpSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Signup failed");
      }
    }
  };

  // Step 2: OTP verified
  const handleOtpVerified = () => {
    setOtpSent(false);
    onGoLogin?.();
    reset();
  };

  if (otpSent) return <OTPForm email={emailForOTP} onVerified={handleOtpVerified} />;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-6 w-full max-w-md mx-auto">
      {/* Name */}
      <div className="relative">
        <input type="text" placeholder=" " {...register("name")} className={`${inputClass} ${errors.name ? "border-red-500 border-2" : ""}`} />
        <label className="absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none">Name</label>
        {errors.name && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-1">{errors.name.message}</motion.p>}
      </div>

      {/* Email */}
      <div className="relative">
        <input type="email" placeholder=" " {...register("email")} className={`${inputClass} ${errors.email ? "border-red-500 border-2" : ""}`} />
        <label className="absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none">Email</label>
        {errors.email && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-1">{errors.email.message}</motion.p>}
      </div>

      {/* Password */}
      <div className="relative">
        <input type={showPassword ? "text" : "password"} placeholder=" " {...register("password")} className={`${inputClass} pr-10 ${errors.password ? "border-red-500 border-2" : ""}`} />
        <label className="absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none">Password</label>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-green-300" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </div>
        {errors.password && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-1">{errors.password.message}</motion.p>}
      </div>

      {/* Confirm Password */}
      <div className="relative">
        <input type={showPassword ? "text" : "password"} placeholder=" " {...register("confirmPassword")} className={`${inputClass} ${errors.confirmPassword ? "border-red-500 border-2" : ""}`} />
        <label className="absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
          peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none">Confirm Password</label>
        {errors.confirmPassword && <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</motion.p>}
      </div>

      {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

      {/* Submit */}
      <motion.input type="submit" value={loading ? "Signing up..." : "Sign Up"} disabled={loading}
        whileHover={{ scale: loading ? 1 : 1.03 }} whileTap={{ scale: loading ? 1 : 0.97 }}
        className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" />
    </form>
  );
}