import { FC, useState } from 'react';
import { DocumentArrowDownIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface DownloadPdfButtonProps {
  markdown: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const DownloadPdfButton: FC<DownloadPdfButtonProps> = ({
  markdown,
  className,
  variant = 'default',
  size = 'default',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGeneratePdf = async () => {
    try {
      setIsGenerating(true);

      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markdown }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create temporary link to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // You might want to add a toast notification here
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleGeneratePdf} disabled={isGenerating} className={className} variant={variant} size={size}>
      <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
      {isGenerating ? 'Generating PDF...' : 'Download PDF'}
    </Button>
  );
};

export default DownloadPdfButton;
