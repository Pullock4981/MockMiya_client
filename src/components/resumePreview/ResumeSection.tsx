"use client";

import React from "react";

interface ResumeSectionProps {
  title: string;
  isEmpty?: boolean;
  children?: React.ReactNode;
}

const ResumeSection: React.FC<ResumeSectionProps> = ({ title, isEmpty, children }) => {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-1">
        {title}
      </h2>

      {isEmpty ? (
        <div className="animate-pulse space-y-2 mt-2">
          <div className="h-3 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-2/3"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
        </div>
      ) : (
        children
      )}
    </section>
  );
};

export default ResumeSection;
