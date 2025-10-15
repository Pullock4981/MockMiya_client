'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import { canAttemptLogin, getBlockedUntil, recordLoginAttempt } from "@/lib/loginRateLimiter";

import OTPForm from './Forms/OTPForm';
import ResetPasswordForm from './Forms/ResetPasswordForm';
import ForgotForm from './Forms/ForgotForm';
import SuccessForm from './Forms/SuccessForm';
import LoginBlocked from './Forms/LoginBlocked';

type LoginFormData = { email: string; password: string; remember?: boolean };

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

export default function LoginForm() {
  const [step, setStep] = useState<'login' | 'forgot' | 'otp' | 'reset' | 'success'>('login');
  const [emailForOTP, setEmailForOTP] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/dashboard';

  const { register, handleSubmit, reset, formState: { errors }, setValue, watch } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const watchEmail = watch('email');
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  const inputClass =
    'peer w-full rounded-xl bg-[#1a231f]/90 px-4 pt-5 pb-2 text-green-200 outline-none transition-all duration-300 border border-green-800/50';

  // ----------------- Auto-focus & remembered email -----------------
  useEffect(() => {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) setValue('email', rememberedEmail);
    firstInputRef.current?.focus();
  }, [step, setValue]);

  // ----------------- Load blockedUntil from localStorage -----------------
  useEffect(() => {
    if (watchEmail) {
      const storedBlocked = localStorage.getItem('blockedUntil_' + watchEmail);
      if (storedBlocked) {
        const ts = parseInt(storedBlocked);
        if (!isNaN(ts) && ts > Date.now()) {
          setBlockedUntil(ts);
        } else {
          localStorage.removeItem('blockedUntil_' + watchEmail);
          setBlockedUntil(null);
        }
      }
    }
  }, [watchEmail]);

  // ----------------- Update blockedUntil in localStorage -----------------
  useEffect(() => {
    if (watchEmail) {
      if (blockedUntil) {
        localStorage.setItem('blockedUntil_' + watchEmail, blockedUntil.toString());
      } else {
        localStorage.removeItem('blockedUntil_' + watchEmail);
      }
    }
  }, [blockedUntil, watchEmail]);

  // ----------------- Track session loading -----------------
  useEffect(() => {
    if (status !== 'loading') setLoading(false);
  }, [status]);

  // ----------------- Login submission -----------------
  const onSubmitLogin = async (data: LoginFormData) => {
    if (blockedUntil && blockedUntil > Date.now()) return;

    setLoading(true);
    setLoginError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res || res.error) {
        recordLoginAttempt(data.email, false);
        setLoginError(res?.error || 'Login failed. Please check your email and password.');

        if (!canAttemptLogin(data.email)) {
          setBlockedUntil(getBlockedUntil(data.email));
        }
        return;
      }

      recordLoginAttempt(data.email, true);

      if (data.remember) localStorage.setItem('rememberedEmail', data.email);
      else localStorage.removeItem('rememberedEmail');

      toast.success(`Welcome ${data.email}!`);
      setStep('success');
      setTimeout(() => router.push(redirectPath), 1500);

    } catch (err: unknown) {
      recordLoginAttempt(data.email, false);
      setLoginError(err instanceof Error ? err.message : 'Login failed');

      if (!canAttemptLogin(data.email)) {
        setBlockedUntil(getBlockedUntil(data.email));
      }
    } finally {
      setLoading(false);
    }
  };

  // ----------------- OTP / Forgot / Reset handlers -----------------
  const handleForgotPassword = (email: string) => {
    setEmailForOTP(email);
    setStep('otp');
  };

  const handleOtpVerified = () => setStep('reset');
  const handleResetSuccess = () => {
    toast.success('Password reset successfully!');
    setStep('login');
    reset();
  };

  // ----------------- Conditional Rendering -----------------
  if (step === 'forgot')
    return <ForgotForm onSubmit={handleForgotPassword} onBack={() => setStep('login')} />;

  if (step === 'otp')
    return <OTPForm email={emailForOTP} onVerified={handleOtpVerified} onResend={() => setStep('forgot')} />;

  if (step === 'reset')
    return <ResetPasswordForm email={emailForOTP} onResetSuccess={handleResetSuccess} />;

  if (step === 'success')
    return <SuccessForm />;

  if (blockedUntil && blockedUntil > Date.now()) {
    return (
      <LoginBlocked
        email={watchEmail}
        blockedUntil={blockedUntil}
        onUnlock={() => setBlockedUntil(null)}
        lockDuration={2 * 60 * 1000}
      />
    );
  }

  // ----------------- Default Login Form -----------------
  return (
    <>
      {loginError && <div className="text-red-500 text-sm text-center mb-2">{loginError}</div>}

      <form onSubmit={handleSubmit(onSubmitLogin)} className="flex flex-col space-y-6 w-full max-w-md mx-auto">
        {/* Email */}
        <div className="relative">
          <input
            type="email"
            placeholder=" "
            {...register('email', { required: true })}
            className={`${inputClass} ${errors.email ? 'border-red-500 border-2' : ''}`}
          />
          <label className="absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
            peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none">
            Email
          </label>
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder=" "
            className={`${inputClass} pr-10 ${errors.password ? 'border-red-500 border-2' : ''}`}
          />
          <label className="absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
            peer-placeholder-shown:top-5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none">
            Password
          </label>
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-green-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        {/* Remember & Forgot */}
        <div className="flex items-center justify-between space-x-2">
          <div className='flex items-center'>
            <input
              type="checkbox"
              id="remember"
              {...register('remember')}
              className="h-4 w-4 text-green-600 border-green-600 rounded focus:ring-0"
            />
            <label htmlFor="remember" className="text-sm text-green-300 select-none cursor-pointer">
              Remember Me
            </label>
          </div>

          <div className="flex justify-end">
            <button type="button" className="text-green-400 hover:underline text-sm" onClick={() => setStep('forgot')}>
              Forgot Password?
            </button>
          </div>
        </div>

        {/* Submit */}
        <motion.input
          type="submit"
          value={loading || status === 'loading' ? 'Signing in...' : 'Sign in'}
          disabled={loading || status === 'loading'}
          whileHover={{ scale: loading || status === 'loading' ? 1 : 1.03 }}
          whileTap={{ scale: loading || status === 'loading' ? 1 : 0.97 }}
          className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </form>
    </>
  );
}
