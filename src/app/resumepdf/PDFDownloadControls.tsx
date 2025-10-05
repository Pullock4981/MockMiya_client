'use client';

import { useState } from 'react';
import { Download, Printer, Loader2 } from 'lucide-react';

interface PDFDownloadControlsProps {
  fileName?: string;
}

export default function PDFDownloadControls({ fileName = 'resume' }: PDFDownloadControlsProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    try {
      setIsGenerating(true);
      
      // Dynamically import the required libraries
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;
      
      // Get the resume content
      const resumeElement = document.querySelector('.print-container') as HTMLElement;
      
      if (!resumeElement) {
        throw new Error('Resume content not found');
      }

      // Create a temporary container with print styles
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'fixed';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '0';
      tempContainer.style.width = '210mm';
      tempContainer.style.minHeight = '297mm';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '0';
      tempContainer.style.margin = '0';
      
      // Clone the resume element
      const clone = resumeElement.cloneNode(true) as HTMLElement;
      clone.style.width = '100%';
      clone.style.height = 'auto';
      clone.style.margin = '0';
      clone.style.padding = '0';
      clone.style.backgroundColor = 'white';
      
      tempContainer.appendChild(clone);
      document.body.appendChild(tempContainer);

      // Generate canvas with high quality
      const canvas = await html2canvas(tempContainer, {
        scale: 3, // High resolution for print quality
        useCORS: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        logging: false,
        width: tempContainer.scrollWidth,
        height: tempContainer.scrollHeight,
        onclone: (clonedDoc, element) => {
          // Apply print styles to the cloned element
          const clonedResume = element.querySelector('.print-container') as HTMLElement;
          if (clonedResume) {
            clonedResume.style.width = '100%';
            clonedResume.style.margin = '0';
            clonedResume.style.padding = '0';
            clonedResume.style.backgroundColor = 'white';
          }
        }
      });

      // Clean up temporary container
      document.body.removeChild(tempContainer);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      // Calculate image dimensions
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const scaledWidth = imgWidth * ratio;
      const scaledHeight = imgHeight * ratio;
      
      // Add image to PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);

      // Save the PDF
      pdf.save(`${fileName.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try the print function instead.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="no-print fixed top-4 right-4 z-50 flex gap-3 bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg p-4 shadow-lg">
      <button
        onClick={handleDownloadPDF}
        disabled={isGenerating}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium min-w-[160px] justify-center"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Generating PDF...
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            Download PDF
          </>
        )}
      </button>

      <button
        onClick={handlePrint}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm font-medium min-w-[120px] justify-center"
      >
        <Printer className="w-4 h-4" />
        Print
      </button>
    </div>
  );
}