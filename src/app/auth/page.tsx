// // Mock Miya Project

// // src/app/aoth/page.tsx

// "use client";
// import React, { useState } from "react";
// import { AnimatePresence, motion } from "framer-motion";
// import RegisterForm from "./Forms/RegisterForm";
// import OTPForm from "./Forms/OTPForm";
// import LoginForm from "./Forms/LoginForm";
// import ForgotForm from "./Forms/ForgotForm";
// import ResetPasswordForm from "./Forms/ResetPasswordForm";
// import SuccessForm from "./Forms/SuccessForm";


// type Step =
//   | "register"
//   | "login"
//   | "forgot"
//   | "otpForgot"
//   | "reset"
//   | "otpRegister"
//   | "success";

// export default function MultiStepAuthPage() {
//   const [step, setStep] = useState<Step>("register");
//   const [email, setEmail] = useState("");

//   const [direction, setDirection] = useState(1);

//   const nextStep = (next: Step) => {
//     setDirection(1);
//     setStep(next);
//   };

//   const prevStep = (prev: Step) => {
//     setDirection(-1);
//     setStep(prev);
//   };

//   const variants = {
//     enter: (dir: number) => ({ x: dir > 0 ? 300 : -300, opacity: 0 }),
//     center: { x: 0, opacity: 1 },
//     exit: (dir: number) => ({ x: dir > 0 ? -300 : 300, opacity: 0 }),
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center p-6">
//       <AnimatePresence mode="wait" custom={direction}>

//         {/* Register */}
//         {step === "register" && (
//           <motion.div
//             key="register"
//             custom={direction}
//             variants={variants}
//             initial="enter"
//             animate="center"
//             exit="exit"
//             transition={{ duration: 0.4 }}
//           >
//             <RegisterForm
//               onRegistered={(userEmail) => {
//                 setEmail(userEmail);
//                 nextStep("otpRegister"); // OTP for registration
//               }}
//               onGoLogin={() => nextStep("login")}
//             />
//           </motion.div>
//         )}


//         {/* OTP after registration */}
//         {step === "otpRegister" && (
//           <motion.div key="otpRegister" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
//             <OTPForm
//               email={email}
//               onVerified={() => nextStep("login")}
//               onResend={async () => {
//                 await fetch("/api/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
//                 alert("OTP resent to your email");
//               }}
//             />
//           </motion.div>
//         )}

//         {/* Login */}
//         {step === "login" && (
//           <motion.div key="login" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
//             <LoginForm
//               email={email}
//               onLoginSuccess={() => nextStep("success")}
//               onRegister={() => nextStep("register")}
//               onForgot={() => nextStep("forgot")}
//               onRequireOTP={(userEmail) => {
//                 setEmail(userEmail);
//                 nextStep("otpRegister");
//               }}
//             />
//           </motion.div>
//         )}

//         {/* Forgot password → email input */}
//         {step === "forgot" && (
//           <motion.div key="forgot" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
//             <ForgotForm
//               onSubmit={(userEmail) => {
//                 setEmail(userEmail);
//                 nextStep("otpForgot"); // OTP for forgot password
//               }}
//               onBack={() => prevStep("login")}
//             />
//           </motion.div>
//         )}

//         {/* OTP after forgot password */}
//         {step === "otpForgot" && (
//           <motion.div key="otpForgot" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
//             <OTPForm
//               email={email}
//               onVerified={() => nextStep("reset")}
//               onResend={async () => {
//                 await fetch("/api/send-otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
//                 alert("OTP resent to your email");
//               }}
//             />
//           </motion.div>
//         )}

//         {/* Reset password */}
//         {step === "reset" && (
//           <motion.div key="reset" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
//             <ResetPasswordForm
//               email={email}
//               otp={otp}
//               onResetSuccess={() => nextStep("login")}
//               onBack={() => prevStep("otpForgot")}
//             />
//           </motion.div>
//         )}

//         {/* Success */}
//         {step === "success" && (
//           <motion.div key="success" custom={direction} variants={variants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.4 }}>
//             <SuccessForm message="Account created successfully!" />
//           </motion.div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }




'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Lottie from 'lottie-react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import loginAnimation from '@/assets/lottie/login.json';
import signupAnimation from '@/assets/lottie/signup.json';


import LoginForm from './LoginForm';
import SignupFormComponent from './SignupForm'; // আলাদা SignupForm
import GoogleLoginButton from './socialAuth/GoogleLogin';

function AuthPageInner() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<'signin' | 'signup'>('signin');

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'signin' || tab === 'signup') setActiveTab(tab);
  }, [searchParams]);

  const tabX = activeTab === 'signin' ? '0%' : '100%';

  const handleSwitchToLogin = () => setActiveTab('signin');

  return (
    <div className="relative z-10 w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-10">
      {/* Left Column */}
      <div className="w-full md:w-1/2 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-green-400 hover:text-green-300 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-[#0f1412]/90 backdrop-blur-xl border border-green-900/50 p-8 rounded-3xl">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-center">Welcome</h1>
            <p className="text-lg text-center">Sign in to your account or create a new one</p>
          </div>

          {/* Social login */}
          <div className='py-8'>
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
