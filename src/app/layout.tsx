"use client";

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { Geist, Geist_Mono } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/context/AuthContext/AuthContext";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

interface RootLayoutProps {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const pathname = usePathname();

  // যেসব রুটে Navbar/Footer দেখানো হবে না
  const noLayoutRoutes = ["/dashboard", "/auth", "/checkout"];

  // চেক করি বর্তমান রুট ওইগুলোর মধ্যে পড়ে কিনা
  const hideLayout = noLayoutRoutes.some((path) =>
    pathname.startsWith(path)
  );

  return (
    <html lang="en" className="antialiased" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <SessionProvider>
          <AuthProvider>
            <ThemeProvider>
              
                {/* শুধু রুট রুটগুলোতে Navbar/Footer দেখাবে */}
                {!hideLayout && <Navbar />}
                {children}
                {!hideLayout && <Footer />}
              

              {/* Toast notification container */}
              <ToastContainer position="top-center" autoClose={3000} />
            </ThemeProvider>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}