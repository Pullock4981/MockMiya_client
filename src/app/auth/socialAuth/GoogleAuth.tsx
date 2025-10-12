'use client';

import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { useAuth } from '../../../context/AuthContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserCredential } from 'firebase/auth';

const GoogleAuth = () => {
  const { googleSignIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGoogleSignIn = async () => {
    try {
      const result: UserCredential = await googleSignIn();
      const user = result.user;

      toast.success(`Welcome ${user.displayName ?? 'User'} 🎉`, {
        position: 'top-center',
      });

      const from = searchParams.get('from') ?? '/';
      router.push(from);
    } catch (error: unknown) {
      // Fully type-safe error handling
      let message = 'Google Sign In failed';

      if (error instanceof Error) {
        message = error.message;
      }

      console.error('Google Sign In Error:', message);
      toast.error(message, { position: 'top-center' });
    }
  };

  return (
    <div className="text-center space-y-4">
      <button
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-3 px-6 py-3 
                   bg-[#0f1412]/80 border border-green-900/40 
                   rounded-xl text-green-200 font-semibold
                   hover:bg-[#0f1412]/60 hover:text-green-100
                   transition-all duration-300 shadow-[0_0_10px_rgba(0,255,120,0.15)]
                   active:scale-95"
      >
        <FcGoogle size={22} />
        <span>Continue with Google</span>
      </button>

      <div className="flex items-center justify-center gap-4">
        <div className="h-[1px] flex-1 bg-green-900/40"></div>
        <span className="text-green-400 text-sm font-medium">OR</span>
        <div className="h-[1px] flex-1 bg-green-900/40"></div>
      </div>
    </div>
  );
};

export default GoogleAuth;