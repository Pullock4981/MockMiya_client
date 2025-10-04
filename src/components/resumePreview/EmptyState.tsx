"use client";

import React from "react";

const EmptyState: React.FC = () => {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="text-4xl">📄</div>
      <h3 className="text-lg font-medium text-muted-foreground">
        Your resume will appear here
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto">
        Start filling out the form on the left to see your professional resume come to life with real-time preview.
      </p>
    </div>
  );
};

export default EmptyState;
