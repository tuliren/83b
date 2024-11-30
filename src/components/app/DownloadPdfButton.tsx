import { FC, useState } from 'react';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface DownloadPdfButtonProps {
  markdown: string;
  filename?: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const DownloadPdfButton: FC<DownloadPdfButtonProps> = ({
  markdown,
  filename = 'document.pdf',
  className,
  variant = 'default',
  size = 'default',
}) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    try {
      setIsGenerating(true);
      const response = await fetch('/api/get-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markdown,
          filename,
          download: true,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleDownload} disabled={isGenerating} className={className} variant={variant} size={size}>
      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
      {isGenerating ? 'Generating...' : 'Download'}
    </Button>
  );
};

export default DownloadPdfButton;
