'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import { useAuth } from './context/AuthContext';

// Validation schema
const signupSchema = z
  .object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupForm() {
  const { createUser, updateUser, loading } = useAuth();
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordValidation, setPasswordValidation] = useState({
    hasNumber: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    isLongEnough: false,
  });

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const password = watch('password', '');

  // Password validation check
  useEffect(() => {
    setPasswordValidation({
      hasNumber: /\d/.test(password),
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[^\w\s]/.test(password),
      isLongEnough: password.length >= 6,
    });
  }, [password]);

  const validatePassword = (pwd: string) => {
    return (
      (/\d/.test(pwd) &&
        /[A-Z]/.test(pwd) &&
        /[a-z]/.test(pwd) &&
        /[^\w\s]/.test(pwd) &&
        pwd.length >= 6) ||
      'Password does not meet complexity requirements'
    );
  };

  const onSubmit = async (data: SignupFormData) => {
    try {
      const userCredential = await createUser(data.email, data.password);

      if (data.name) {
        await updateUser({ displayName: data.name });
      }

      toast('🦄 Account created successfully!');
      router.push('/dashboard');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Failed to create account');
    }
  };

  const inputClass =
    'peer w-full rounded-xl bg-[#1a231f]/90 px-4 pt-5 pb-2 text-green-200 outline-none transition-all duration-300 border border-green-800/50';

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-6 w-full max-w-md mx-auto"
      >
        {/* Name */}
        <div className="relative">
          <input
            type="text"
            {...register('name')}
            placeholder=" "
            className={`${inputClass} ${errors.name ? 'border-red-500 border-2' : ''}`}
            autoComplete="name"
          />
          <label
            className={`
              absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-green-200 peer-placeholder-shown:text-base
              peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none
            `}
          >
            Your Name
          </label>
          {errors.name && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.name.message}
            </motion.p>
          )}
        </div>

        {/* Email */}
        <div className="relative">
          <input
            type="email"
            {...register('email')}
            placeholder=" "
            className={`${inputClass} ${errors.email ? 'border-red-500 border-2' : ''}`}
            autoComplete="email"
          />
          <label
            className={`
              absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-green-200 peer-placeholder-shown:text-base
              peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none
            `}
          >
            Email
          </label>
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              {...register('password', { validate: validatePassword })}
              placeholder=" "
              className={`${inputClass} pr-10 ${errors.password ? 'border-red-500 border-2' : ''}`}
              autoComplete="new-password"
            />
            <label
              className={`
      absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
      peer-placeholder-shown:top-5 peer-placeholder-shown:text-green-200 peer-placeholder-shown:text-base
      peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none
    `}
            >
              Password
            </label>
            <div
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-green-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>

          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.password.message as string}
            </motion.p>
          )}
          {/* Password Strength */}
          <ul className="text-xs text-green-400 mt-1 pl-4 list-disc">
            <li className={passwordValidation.isLongEnough ? 'text-green-400' : 'text-red-500'}>
              At least 6 characters
            </li>
            <li className={passwordValidation.hasUpperCase ? 'text-green-400' : 'text-red-500'}>
              At least 1 uppercase letter
            </li>
            <li className={passwordValidation.hasLowerCase ? 'text-green-400' : 'text-red-500'}>
              At least 1 lowercase letter
            </li>
            <li className={passwordValidation.hasNumber ? 'text-green-400' : 'text-red-500'}>
              At least 1 number
            </li>
            <li className={passwordValidation.hasSpecialChar ? 'text-green-400' : 'text-red-500'}>
              At least 1 special character
            </li>
          </ul>
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <input
            type={showConfirmPassword ? 'text' : 'password'}
            {...register('confirmPassword')}
            placeholder=" "
            className={`${inputClass} ${errors.confirmPassword ? 'border-red-500 border-2' : ''}`}
            autoComplete="new-password"
          />
          <label
            className={`
              absolute left-4 top-2 text-green-400 text-sm transition-all duration-300
              peer-placeholder-shown:top-5 peer-placeholder-shown:text-green-200 peer-placeholder-shown:text-base
              peer-focus:top-1 peer-focus:text-green-400 peer-focus:text-sm pointer-events-none
            `}
          >
            Confirm Password
          </label>
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-green-300"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.confirmPassword && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.confirmPassword.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <motion.input
          type="submit"
          value={loading ? 'Signing up...' : 'Sign Up'}
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </form>

      {/* Autofill Fix */}
      <style jsx global>{`
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px #1a231f inset !important;
          -webkit-text-fill-color: #adebad !important;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>
    </>
  );
}
