// "use client";

// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Palette, Download, Layout, Share2, Eye, EyeOff } from "lucide-react";
// import { exportResumeHandler } from "@/utils/exportResume";
// import { useResumeTheme } from "./ResumeThemeContext";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import TemplateSelector from "@/utils/TemplateSelector";

// export type TextTheme = "Default" | "Green" | "Blue" | "Orange" | "Purple";

// const themeColors: { name: TextTheme; colors: [string, string] }[] = [
//   { name: "Default", colors: ["#ffffff", "#000000"] },
//   { name: "Green", colors: ["#ffffff", "#34A853"] },
//   { name: "Blue", colors: ["#ffffff", "#1A73E8"] },
//   { name: "Orange", colors: ["#ffffff", "#FB8C00"] },
//   { name: "Purple", colors: ["#ffffff", "#9C27B0"] },
// ];

// interface ResumeControlsProps {
//   atsScore?: number;
//   showATSDetails: boolean;
//   setShowATSDetails: (value: boolean) => void;
//   template: string;
//   setTemplate: (template: string) => void;
//   userId: string;
//   theme: "Light" | "Dark";
//   setTheme: (theme: "Light" | "Dark") => void;
// }

// const ResumeControls: React.FC<ResumeControlsProps> = ({
//   atsScore,
//   showATSDetails,
//   setShowATSDetails,
//   template,
//   setTemplate,
// }) => {
//   const { textTheme, setTextTheme } = useResumeTheme();
//   const [openTemplateSelector, setOpenTemplateSelector] = useState(false);

//   const handleExport = async () => {
//     try {
//       await exportResumeHandler();
//     } catch (error) {
//       console.error("PDF Export failed:", error);
//     }
//   };

//   return (
//     <div className="flex flex-wrap justify-between items-center gap-4 bg-foreground-muted p-2 rounded-lg">
//       {/* ATS Toggle */}
//       <div className="flex items-center gap-3">
//         {atsScore !== undefined && (
//           <Button
//             variant="ghost"
//             size="sm"
//             onClick={() => setShowATSDetails(!showATSDetails)}
//           >
//             {showATSDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
//           </Button>
//         )}
//       </div>

//       {/* Controls */}
//       <div className="flex items-center gap-2 flex-wrap">
//         {/* Template Selector */}
//         <Popover open={openTemplateSelector} onOpenChange={setOpenTemplateSelector}>
//           <PopoverTrigger asChild>
//             <Button variant="outline" size="sm" className="flex items-center gap-2">
//               <Layout className="h-4 w-4" /> {template}
//             </Button>
//           </PopoverTrigger>
//           <PopoverContent className="w-[350px]">
//             <TemplateSelector
//               selectedTemplate={template}
//               onSelectTemplate={(tpl) => {
//                 setTemplate(tpl);
//                 setOpenTemplateSelector(false);
//               }}
//             />
//           </PopoverContent>
//         </Popover>

//         {/* Color Palette */}
//         <div className="flex items-center gap-2">
//           <Palette className="h-4 w-4" />
//           <div className="flex gap-1">
//             {themeColors.map((t) => (
//               <button
//                 key={t.name}
//                 onClick={() => setTextTheme(t.name)}
//                 className={`w-6 h-6 rounded-full border border-gray-300 flex overflow-hidden cursor-pointer ${
//                   textTheme === t.name ? "ring-2 ring-offset-1 ring-primary" : ""
//                 }`}
//               >
//                 <div className="w-1/2 h-full" style={{ backgroundColor: t.colors[0] }} />
//                 <div className="w-1/2 h-full" style={{ backgroundColor: t.colors[1] }} />
//               </button>
//             ))}
//           </div>
//         </div>

//         <Button variant="outline" size="sm" onClick={handleExport}>
//           <Download className="h-4 w-4" /> PDF
//         </Button>

//         <Button variant="outline" size="sm" className="flex items-center gap-2">
//           <Share2 className="h-4 w-4" /> Share
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default ResumeControls;




"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Palette, Download, Layout, Share2, Eye, EyeOff } from "lucide-react";
import { exportResumeHandler } from "@/utils/exportResume";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import TemplateSelector from "@/utils/TemplateSelector";
import { useMeta } from "@/context/ResumeContext/MetaContext";

const themeColors = [
  { name: "Default", colors: ["#ffffff", "#000000"] },
  { name: "Green", colors: ["#ffffff", "#34A853"] },
  { name: "Blue", colors: ["#ffffff", "#1A73E8"] },
  { name: "Orange", colors: ["#ffffff", "#FB8C00"] },
  { name: "Purple", colors: ["#ffffff", "#9C27B0"] },
];

interface ResumeControlsProps {
  showATSDetails: boolean;
  setShowATSDetails: (value: boolean) => void;
  userId: string;
}

const ResumeControls: React.FC<ResumeControlsProps> = ({ showATSDetails, setShowATSDetails }) => {
  const { template, updateTemplate, theme, updateTheme, atsScore } = useMeta(); 
  const [openTemplateSelector, setOpenTemplateSelector] = useState(false);

  const handleExport = async () => {
    try {
      await exportResumeHandler();
    } catch (error) {
      console.error("PDF Export failed:", error);
    }
  };

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 bg-foreground-muted p-2 rounded-lg">
      {/* ATS Toggle */}
      <div className="flex items-center gap-3">
        {atsScore && (
          <Button variant="ghost" size="sm" onClick={() => setShowATSDetails(!showATSDetails)}>
            {showATSDetails ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Template Selector */}
        <Popover open={openTemplateSelector} onOpenChange={setOpenTemplateSelector}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Layout className="h-4 w-4" /> {template.name}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[350px]">
            <TemplateSelector
              selectedTemplate={template.name}
              onSelectTemplate={(tpl) => {
                updateTemplate({ ...template, name: tpl });
                setOpenTemplateSelector(false);
              }}
            />
          </PopoverContent>
        </Popover>

        {/* Color Palette */}
        <div className="flex items-center gap-2">
          <Palette className="h-4 w-4" />
          <div className="flex gap-1">
            {themeColors.map((t) => (
              <button
                key={t.name}
                onClick={() => updateTheme({ ...theme, name: t.name })}
                className={`w-6 h-6 rounded-full border border-gray-300 flex overflow-hidden cursor-pointer ${
                  theme.name === t.name ? "ring-2 ring-offset-1 ring-primary" : ""
                }`}
              >
                <div className="w-1/2 h-full" style={{ backgroundColor: t.colors[0] }} />
                <div className="w-1/2 h-full" style={{ backgroundColor: t.colors[1] }} />
              </button>
            ))}
          </div>
        </div>

        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4" /> PDF
        </Button>

        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="h-4 w-4" /> Share
        </Button>
      </div>
    </div>
  );
};

export default ResumeControls;
