// 'use client';

// import { zodResolver } from '@hookform/resolvers/zod';
// import { motion } from 'framer-motion';
// import { Eye, EyeOff } from 'lucide-react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { useState } from 'react';
// import { useForm } from 'react-hook-form';
// import { z } from 'zod';
// import { useAuth } from '../../context/AuthContext';
// import { toast } from 'react-toastify';

// const loginSchema = z.object({
//   email: z.string().email('Invalid email address'),
//   password: z.string().min(6, 'Password must be at least 6 characters'),
// });

// type LoginFormData = z.infer<typeof loginSchema>;

// export default function LoginForm() {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const { signInUser, resetPassword, loading } = useAuth();

//   const {
//     register,
//     handleSubmit,
//     watch,
//     formState: { errors },
//   } = useForm<LoginFormData>({
//     resolver: zodResolver(loginSchema),
//   });

//   const [showPassword, setShowPassword] = useState(false);
//   const emailValue = watch('email');

//   // Type-safe error type
//   type AuthError = {
//     message?: string;
//     code?: string;
//   };

//   const onSubmit = async (data: LoginFormData) => {
//     try {
//       const from = searchParams.get('from') || '/dashboard';
//       const userCredential = await signInUser(data.email, data.password);

//       if (userCredential.user) {
//         toast.success(`Welcome ${userCredential.user.displayName || 'User'} 🎉`);
//         router.push(from);
//       }
//     } catch (error) {
//       const err = error as AuthError;
//       console.error('Login Error:', err);
//       toast.error(err.message ?? 'Login failed. Please try again.', {
//         position: 'top-center',
//       });
//     }
//   };

//   const handleForgotPassword = async () => {
//     if (!emailValue) {
//       toast.error('Please enter your email first!', { position: 'top-center' });
//       return;
//     }
//     try {
//       await resetPassword(emailValue);
//       toast.success('Password reset email sent! Check your inbox.', {
//         position: 'top-center',
//       });
//     } catch (error) {
//       const err = error as AuthError;
//       toast.error(err.message ?? 'Failed to send reset email.', {
//         position: 'top-center',
//       });
//     }
//   };

//   const inputClass =
//     'peer w-full rounded-xl bg-[#1a231f]/90 px-4 pt-5 pb-2 text-green-200 outline-none transition-all duration-300 border border-green-800/50';

//   return (
//     <>
//       <form className="flex flex-col space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
//         {/* Email */}
//         <div className="relative">
//           <input
//             type="email"
//             {...register('email')}
//             placeholder=" "
//             className={`${inputClass} ${errors.email ? 'border-red-500 border-2' : ''}`}
//             autoComplete="email"
//           />
//           <label
//             className={`
//               absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
//               peer-placeholder-shown:top-5 peer-placeholder-shown:text-green-200 peer-placeholder-shown:text-base
//               peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none
//             `}
//           >
//             Email
//           </label>
//           {errors.email && (
//             <motion.p
//               initial={{ opacity: 0, y: -5 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-red-500 text-sm mt-1"
//             >
//               {errors.email.message}
//             </motion.p>
//           )}
//         </div>

//         {/* Password */}
//         <div className="relative">
//           <input
//             type={showPassword ? 'text' : 'password'}
//             {...register('password')}
//             placeholder=" "
//             className={`${inputClass} pr-10 ${errors.password ? 'border-red-500 border-2' : ''}`}
//             autoComplete="current-password"
//           />
//           <label
//             className={`
//               absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
//               peer-placeholder-shown:top-5 peer-placeholder-shown:text-green-200 peer-placeholder-shown:text-base
//               peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none
//             `}
//           >
//             Password
//           </label>
//           <div
//             className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-green-300"
//             onClick={() => setShowPassword(!showPassword)}
//           >
//             {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//           </div>
//           {errors.password && (
//             <motion.p
//               initial={{ opacity: 0, y: -5 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="text-red-500 text-sm mt-1"
//             >
//               {errors.password.message}
//             </motion.p>
//           )}
//         </div>

//         {/* Forgot Password */}
//         <div className="flex justify-end">
//           <button
//             type="button"
//             onClick={handleForgotPassword}
//             className="text-green-400 hover:underline text-sm"
//           >
//             Forgot Password?
//           </button>
//         </div>

//         {/* Submit Button */}
//         <motion.input
//           type="submit"
//           value={loading ? 'Signing in...' : 'Signin'}
//           whileHover={{ scale: loading ? 1 : 1.03 }}
//           whileTap={{ scale: loading ? 1 : 0.97 }}
//           disabled={loading}
//           className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 
//              shadow-[0_0_5px_rgba(0,255,100,0.5)] 
//              hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] 
//              cursor-pointer 
//              disabled:opacity-50 
//              disabled:cursor-not-allowed"
//         />
//       </form>

//       {/* Autofill Fix */}
//       <style jsx global>{`
//         input:-webkit-autofill {
//           -webkit-box-shadow: 0 0 0px 1000px #1a231f inset !important;
//           -webkit-text-fill-color: #adebad !important;
//           transition: background-color 5000s ease-in-out 0s;
//         }
//       `}</style>
//     </>
//   );
// }






'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { toast } from 'react-toastify';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';

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
  const [loading, setLoading] = useState(false);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

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

  // ----------------- Blocked check -----------------
  useEffect(() => {
    if (watchEmail) {
      if (!canAttemptLogin(watchEmail)) {
        setBlockedUntil(getBlockedUntil(watchEmail));
      } else {
        setBlockedUntil(null);
      }
    }
  }, [watchEmail]);

  // ----------------- Login submission -----------------
  const onSubmitLogin = async (data: LoginFormData) => {
    if (blockedUntil) return;

    setLoading(true);
    setLoginError(null);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (!res) {
        recordLoginAttempt(data.email, false);
        setLoginError('Login failed. Please check your email and password.');
        return;
      }

      if (res.error) {
        recordLoginAttempt(data.email, false);
        setLoginError(res.error);
        return;
      }

      // Successful login
      recordLoginAttempt(data.email, true);

      if (data.remember) localStorage.setItem('rememberedEmail', data.email);
      else localStorage.removeItem('rememberedEmail');

      toast.success(`Welcome ${data.email}!`);
      setStep('success');

      setTimeout(() => router.push(redirectPath), 1500);

    } catch (err: unknown) {
      recordLoginAttempt(data.email, false);
      setLoginError(err instanceof Error ? err.message : 'Login failed');
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

  // ----------------- Default Login Form -----------------
  return (
    <>
      {blockedUntil && <LoginBlocked email={watchEmail} blockedUntil={blockedUntil} />}
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

        {/* Remember & forgot */}
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
          value={loading ? 'Signing in...' : 'Signin'}
          disabled={loading || !!blockedUntil}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </form>
    </>
  );
}
