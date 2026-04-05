/**
 * PDF Export Button Component
 * 
 * Exports the resume preview as a downloadable PDF.
 * Uses html2canvas to capture the preview and jsPDF to generate the PDF.
 */

import { useState } from 'react';
import { Download, Loader2, FileText } from 'lucide-react';

interface PDFExportButtonProps {
  targetRef: React.RefObject<HTMLElement>;
  filename?: string;
}

export function PDFExportButton({ targetRef, filename = 'resume' }: PDFExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    if (!targetRef.current) {
      setError('Resume preview not found');
      return;
    }

    setIsExporting(true);
    setError(null);

    try {
      // Dynamically import to reduce initial bundle size
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const element = targetRef.current;
      
      // Capture the resume preview as canvas
      const canvas = await html2canvas(element, {
        scale: 2, // Higher resolution
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // Calculate PDF dimensions (A4)
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scale to fit width
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10; // Top margin

      // Add image to PDF
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      
      // Download the PDF
      pdf.save(`${filename}.pdf`);
      
    } catch (err) {
      console.error('PDF export failed:', err);
      setError('Failed to export PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm
                   bg-gradient-to-r from-emerald-500 to-teal-600 
                   hover:from-emerald-600 hover:to-teal-700
                   text-white transition-all duration-200 shadow-sm hover:shadow-md
                   disabled:opacity-50 disabled:cursor-not-allowed"
        title="Download as PDF"
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            <Download className="w-4 h-4" />
            PDF
          </>
        )}
      </button>

      {error && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-50 dark:bg-red-900/20 
                        text-red-600 dark:text-red-400 text-xs rounded-lg 
                        whitespace-nowrap z-10 shadow-sm">
          {error}
        </div>
      )}
    </div>
  );
}
