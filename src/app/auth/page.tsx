'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { ArrowLeft, User2, UserStar } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { getSession, signIn } from 'next-auth/react';

import loginAnimation from '@/assets/lottie/login.json';
import signupAnimation from '@/assets/lottie/signup.json';

import LoginForm from './LoginForm';
import SignupFormComponent from './SignupForm'; // আলাদা SignupForm
import GoogleLoginButton from './socialAuth/GoogleLogin';
import { Button } from '@/components/ui/button';
import { toast } from 'react-toastify';

function AuthPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  const [autoLoading, setAutoLoading] = useState(false);
  const [autoError, setAutoError] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams?.get('tab') ?? null;
    if (tab === 'signin' || tab === 'signup') setActiveTab(tab);
  }, [searchParams]);

  const tabX = activeTab === 'signin' ? '0%' : '100%';
  const handleSwitchToLogin = () => setActiveTab('signin');


  // Helper: safe extractor for role from a session-like object (avoids any)
function getRoleFromSessionObj(sess: unknown): string | undefined {
  if (!sess || typeof sess !== 'object') return undefined;
  const s = sess as Record<string, unknown>;
  const user = s.user;
  if (!user || typeof user !== 'object') return undefined;
  const u = user as Record<string, unknown>;
  const role = u.role;
  return typeof role === 'string' ? role : undefined;
}



  // Programmatic login using next-auth credentials provider
  const loginUser = async (email: string, password: string) => {
    setAutoError(null);
    setAutoLoading(true);

    try {
      const res = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!res || res.error) {
        setAutoError(res?.error ?? 'Login failed. Please check credentials.');
        setAutoLoading(false);
        return;
      }

      // wait for session
      let finalSession = await getSession();
      const maxAttempts = 20;
      let attempts = 0;
      while (!finalSession?.user && attempts < maxAttempts) {
        await new Promise((r) => setTimeout(r, 150));
        finalSession = await getSession();
        attempts++;
      }

      const userRole = getRoleFromSessionObj(finalSession) ?? 'user';

      const target = userRole === 'Admin' || userRole === 'System Admin'
        ? '/dashboard/admin/panel'
        : '/dashboard';

      toast(`Welcome ${email}!`);
      router.replace(target);

    } catch (err: unknown) {
      setAutoError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setAutoLoading(false);
    }
  };

  return (
    <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10">
      {/* Left Column */}
      <div className="w-full md:w-1/2 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <Button variant={'outline'}>Back to Home</Button>
        </Link>

        <div className="bg-[#0f1412]/90 backdrop-blur-xl border border-green-900/50 p-8 rounded-3xl">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-center">Welcome</h1>
            <p className="text-lg text-center">Sign in to your account or create a new one</p>
          </div>

          {/* Social login */}
          <div className="py-8">
            <GoogleLoginButton />
          </div>

          {/* Tabs */}
          <div className="relative w-full mb-6">
            <div className="grid w-full grid-cols-2 relative bg-[#1a231f]/80 rounded-xl overflow-hidden border border-green-900/40">
              <button
                onClick={() => setActiveTab('signin')}
                className={`relative z-10 text-green-300 px-6 py-3 font-bold uppercase tracking-wide ${activeTab === 'signin' ? 'scale-105' : 'hover:text-green-200'
                  }`}
              >
                Sign In
              </button>
              <button
                onClick={() => setActiveTab('signup')}
                className={`relative z-10 text-green-300 px-6 py-3 font-bold uppercase tracking-wide ${activeTab === 'signup' ? 'scale-105' : 'hover:text-green-200'
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

          {/* Active Form */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 'signin' ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 'signin' ? -50 : 50 }}
            transition={{ duration: 0.4 }}
          >
            {activeTab === 'signin' ? (
              <LoginForm />
            ) : (
              <SignupFormComponent onGoLogin={handleSwitchToLogin} />
            )}
          </motion.div>

          {/* Auto-login Buttons */}
          <div className="pt-5 flex flex-col items-center gap-3">
            <div className="flex justify-center gap-5">
              <Button
                variant="default"
                className="cursor-pointer"
                onClick={() => loginUser('admin@mock-miya.com', 'Admin@123')}
                disabled={autoLoading}
              >
                <UserStar className="mr-2" /> Admin Login
              </Button>

              <Button
                variant="secondary"
                className="cursor-pointer"
                onClick={() => loginUser('jahid.hossen.me@gmail.com', 'Abc@123')}
                disabled={autoLoading}
              >
                <User2 className="mr-2" /> User Login
              </Button>
            </div>

            {/* small inline feedback */}
            {autoLoading && <div className="text-sm text-green-300 mt-2">Signing in...</div>}
            {autoError && <div className="text-sm text-red-500 mt-2">{autoError}</div>}
          </div>
        </div>
      </div>

      {/* Right Column - Lottie */}
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

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="text-center text-green-300">Loading...</div>}>
      <AuthPageInner />
    </Suspense>
  );
}
