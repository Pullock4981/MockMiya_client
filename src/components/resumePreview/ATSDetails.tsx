"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface ATSBreakdown {
  keywords: number;
  formatting: number;
  sections: number;
  length: number;
}

interface ATSScore {
  breakdown: ATSBreakdown;
  suggestions: string[];
}

interface ATSDetailsProps {
  atsScore: ATSScore;
}

const ATSDetails: React.FC<ATSDetailsProps> = ({ atsScore }) => {
  return (
    <Card className="p-4 bg-muted/50 border-border/50">
      <h4 className="font-medium text-foreground mb-3">ATS Score Breakdown</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{atsScore.breakdown.keywords}%</div>
          <div className="text-xs text-muted-foreground">Keywords</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{atsScore.breakdown.formatting}%</div>
          <div className="text-xs text-muted-foreground">Formatting</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{atsScore.breakdown.sections}%</div>
          <div className="text-xs text-muted-foreground">Sections</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-foreground">{atsScore.breakdown.length}%</div>
          <div className="text-xs text-muted-foreground">Length</div>
        </div>
      </div>

      {atsScore.suggestions.length > 0 && (
        <div>
          <h5 className="font-medium text-foreground mb-2">Suggestions:</h5>
          <ul className="space-y-1">
            {atsScore.suggestions.slice(0, 3).map((suggestion: string, index: number) => (
              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary">•</span>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
};

export default ATSDetails;
