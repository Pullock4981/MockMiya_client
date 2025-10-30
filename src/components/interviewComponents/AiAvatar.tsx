import { useEffect, useState } from 'react';

interface AiAvatarProps {
  state: 'idle' | 'listening' | 'thinking' | 'speaking';
}

export const AiAvatar = ({ state }: AiAvatarProps) => {
  const [mouthOpen, setMouthOpen] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (state === 'speaking') {
      interval = setInterval(() => {
        setMouthOpen(prev => !prev);
      }, 150);
    } else {
      setMouthOpen(false);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [state]);

  const getStateColor = () => {
    switch (state) {
      case 'listening': return 'from-green-500 to-emerald-500';
      case 'thinking': return 'from-yellow-500 to-orange-500';
      case 'speaking': return 'from-primary to-accent';
      default: return 'from-primary/50 to-accent/50';
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className={`relative w-48 h-48 rounded-full bg-gradient-to-br ${getStateColor()} p-1 transition-all duration-300 ${state === 'speaking' ? 'animate-pulse' : ''}`} style={{ boxShadow: 'var(--shadow-glow)' }}>
        <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
          <div className="relative">
            {/* Eyes */}
            <div className="flex gap-6 mb-4">
              <div className="w-3 h-3 rounded-full bg-foreground animate-pulse" />
              <div className="w-3 h-3 rounded-full bg-foreground animate-pulse" />
            </div>
            
            {/* Mouth */}
            <div className="flex justify-center">
              {state === 'speaking' && mouthOpen ? (
                <div className="w-8 h-6 rounded-full border-2 border-foreground" />
              ) : (
                <div className="w-8 h-1 rounded-full bg-foreground" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-lg font-semibold capitalize text-foreground">{state}</p>
        <p className="text-sm text-white">
          {state === 'idle' && 'Ready to start'}
          {state === 'listening' && 'Listening to your answer...'}
          {state === 'thinking' && 'Processing your response...'}
          {state === 'speaking' && 'AI is asking a question...'}
        </p>
      </div>
    </div>
  );
};