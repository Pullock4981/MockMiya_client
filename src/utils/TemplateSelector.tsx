// "use client";

// import React from "react";
// import { Button } from "@/components/ui/button";

// interface TemplateSelectorProps {
//   selectedTemplate?: string;
//   onSelectTemplate?: (template: string) => void;
// }

// const templates = ["Single Column", "Double Column", "Modern", "Minimal"];

// const TemplateSelector: React.FC<TemplateSelectorProps> = ({
//   selectedTemplate,
//   onSelectTemplate,
// }) => {
//   return (
//     <div className="grid grid-cols-2 gap-3">
//       {templates.map((template) => (
//         <Button
//           key={template}
//           size="sm"
//           className="h-20 w-28 flex flex-col items-center justify-center"
//           variant={selectedTemplate === template ? "default" : "outline"}
//           onClick={() => onSelectTemplate?.(template)}
//         >
//           <span className="text-xs">{template}</span>
//         </Button>
//       ))}
//     </div>
//   );
// };

// export default TemplateSelector;




"use client";

import React from "react";
import Image from "next/image";

interface TemplateSelectorProps {
  selectedTemplate?: string;
  onSelectTemplate?: (template: string) => void;
}

const templates = [
  { name: "Classic", thumbnail: "/resume-template/ATS.jpg" },
  { name: "Modern", thumbnail: "/resume-template/Modern.png" },
  { name: "Creative", thumbnail: "/resume-template/Creative.png" },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onSelectTemplate,
}) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {templates.map((template) => (
        <div
  key={template.name}
  className={`relative border rounded-lg overflow-hidden cursor-pointer hover:shadow-lg transition ${
    selectedTemplate === template.name
      ? "ring-2 ring-blue-500 ring-offset-2 scale-[1.02]"
      : "border-gray-300"
  }`}
  onClick={() => onSelectTemplate?.(template.name)}
>
  <Image
    src={template.thumbnail}
    alt={template.name}
    width={200}
    height={260}
    className="w-full h-32 object-cover"
  />
  <div className="text-center py-2 text-sm font-medium">
    {template.name}
  </div>

  {selectedTemplate === template.name && (
    <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
      Selected
    </div>
  )}
</div>

      ))}
    </div>
  );
};

export default TemplateSelector;
