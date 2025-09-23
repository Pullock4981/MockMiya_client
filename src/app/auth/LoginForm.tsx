'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useAuth } from './context/AuthContext';
import { toast } from 'react-toastify';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signInUser, loading } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);

const onSubmit = async (data: LoginFormData) => {
  try {
    const from = searchParams.get('from') || '/dashboard';
    const userCredential = await signInUser(data.email, data.password);

    if (userCredential.user) {

      toast(`Welcome ${userCredential.user.displayName || 'User'} 🎉`);

      router.push(from);
    }
  } catch (error: any) {
    console.error('Login Error:', error);

    toast.error(error.message || 'Login failed. Please try again.', {
      position: 'top-center',
    });
  }
};


  const inputClass =
    'peer w-full rounded-xl bg-[#1a231f]/90 px-4 pt-5 pb-2 text-green-200 outline-none transition-all duration-300 border border-green-800/50';

  return (
    <>
      <form className="flex flex-col space-y-6 w-full" onSubmit={handleSubmit(onSubmit)}>
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
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            {...register('password')}
            placeholder=" "
            className={`${inputClass} pr-10 ${errors.password ? 'border-red-500 border-2' : ''}`} // 👈 pr-10 for icon space
            autoComplete="current-password"
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
          {/* Eye Icon */}
          <div
            className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-green-300"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </div>
          {errors.password && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-red-500 text-sm mt-1"
            >
              {errors.password.message}
            </motion.p>
          )}
        </div>

        {/* Submit Button */}
        <motion.input
          type="submit"
          value={loading ? 'Signing in...' : 'Signin'}
          whileHover={{ scale: loading ? 1 : 1.03 }}
          whileTap={{ scale: loading ? 1 : 0.97 }}
          disabled={loading}
          className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 
             shadow-[0_0_5px_rgba(0,255,100,0.5)] 
             hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] 
             cursor-pointer 
             disabled:opacity-50 
             disabled:cursor-not-allowed"
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
