'use client';

import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import loginAnimation from '@/assets/lottie/login.json';
import signupAnimation from '@/assets/lottie/signup.json';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import GoogleAuth from './socialAuth/GoogleAuth';

export default function AuthPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signin' || tab === 'signup') setActiveTab(tab);
  }, [searchParams]);

  const tabX = activeTab === 'signin' ? '0%' : '100%';

  return (
    <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10">
      {/* Left: Form & UI */}
      <div className="w-full md:w-1/2 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Auth Card */}
        <div className="bg-[#0f1412]/90 backdrop-blur-xl border border-green-900/50 p-8 rounded-3xl">
          <div>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-center">Welcome</h1>
              <p className="text-lg text-center">Sign in to your account or create a new one</p>
            </div>

            <GoogleAuth />
          </div>

          {/* Tabs */}
          <div className="relative w-full mb-6">
            <div className="grid w-full grid-cols-2 relative bg-[#1a231f]/80 rounded-xl overflow-hidden border border-green-900/40">
              <button
                onClick={() => setActiveTab('signin')}
                className={`relative z-10 text-green-300 px-6 py-3 font-bold uppercase tracking-wide ${
                  activeTab === 'signin' ? 'scale-105' : 'hover:text-green-200'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`relative z-10 text-green-300 px-6 py-3 font-bold uppercase tracking-wide ${
                  activeTab === 'signup' ? 'scale-105' : 'hover:text-green-200'
                }`}
              >
                Sign Up
              </button>

              <motion.div
                className="absolute top-0 left-0 h-full w-1/2 bg-[#0f1412]/80 rounded-xl shadow-[0_0_10px_rgba(0,255,120,0.5)] z-0"
                animate={{ x: tabX }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </div>
          </div>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'signin' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'signin' ? -50 : 50 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'signin' ? <LoginForm /> : <SignupForm />}
          </motion.div>
        </div>
      </div>

      {/* Right: Lottie */}
      <div className="w-full md:w-1/2 flex justify-center">
        <Lottie
          animationData={activeTab === 'signin' ? loginAnimation : signupAnimation}
          loop
          className="w-96 h-96"
        />
      </div>
    </div>
  );
}
