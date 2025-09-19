import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MockMiya",
  description: "AI Resume Builder & Mock Interview Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased bg-gray-50 text-gray-900">{children}</body>
    </html>
  );
}
