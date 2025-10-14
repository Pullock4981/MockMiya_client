// app/auth/layout.tsx
import React from 'react';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="auth-bg min-h-screen flex items-center justify-center text-green-200 relative px-4"
      style={{
        background: `radial-gradient(circle at top left, #161A19 0%, #1A2722 50%, #263732 100%),
                     radial-gradient(circle at top right, #161A19 0%, #1A2722 50%, #263732 100%),
                     radial-gradient(circle at bottom left, #161A19 0%, #1A2722 50%, #263732 100%),
                     radial-gradient(circle at bottom right, #161A19 0%, #1A2722 50%, #263732 100%)`,
      }}
    >
      {children}

    </div>
  );
}


