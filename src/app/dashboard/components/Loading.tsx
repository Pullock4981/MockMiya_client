"use client";

import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const LoadingSpinner = ({
  size = "md",
  className = "",
}: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div
      className={`flex items-center justify-center min-h-screen ${className}`}
    >
      <motion.div
        className={`${sizeClasses[size]} border-2 border-primary/30 border-t-primary rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export const PageLoader = ({
  message = "Loading...",
}: {
  message?: string;
}) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50 gap-4"
  >
    <LoadingSpinner size="lg" />
    <p className="text-foreground-muted"> {message}</p>
  </motion.div>
);
