'use client';

import { ThemeProvider } from '@/components/ui/ThemeProvider';
import { Geist, Geist_Mono } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthContext';

import './globals.css';

const geistSans = Geist({ subsets: ['latin'], variable: '--font-geist', display: 'swap' });
const geistMono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-geist-mono',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode; session?: any }) {
  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>

        {/* SessionProvider must be outside AuthProvider */}
        <SessionProvider>
          <AuthProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </AuthProvider>
        </SessionProvider>

      </body>
    </html>
  );
}
