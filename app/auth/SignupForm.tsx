'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

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

type SignupFormProps = {
  role: 'user' | 'admin';
};

export default function SignupForm({ role }: SignupFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = (data: SignupFormData) => {
    console.log('Signup Data:', data, 'Role:', role);
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
        <div className="relative">
          <input
            type="password"
            {...register('password')}
            placeholder=" "
            className={`${inputClass} ${errors.password ? 'border-red-500 border-2' : ''}`}
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

        {/* Confirm Password */}
        <div className="relative">
          <input
            type="password"
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

        <motion.input
          type="submit"
          value={`Sign Up as ${role}`}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full rounded-xl py-3 text-green-50 font-bold uppercase transition-all duration-300 shadow-[0_0_5px_rgba(0,255,100,0.5)] hover:shadow-[0_0_10px_rgba(0,255,100,0.7)] cursor-pointer"
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
