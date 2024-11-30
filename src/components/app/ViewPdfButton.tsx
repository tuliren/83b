import { FC, useState } from 'react';
import { DocumentMagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { clientStorage } from '@/lib/client-storage';

interface ViewPdfButtonProps {
  markdown: string;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

const ViewPdfButton: FC<ViewPdfButtonProps> = ({ markdown, className, variant = 'default', size = 'default' }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleViewPdf = () => {
    try {
      setIsGenerating(true);

      // Store markdown in localStorage and get ID
      const id = clientStorage.store(markdown);

      // Open PDF viewer in new tab
      window.open(`/pdf-view/${id}`, '_blank');
    } catch (error) {
      console.error('Error viewing PDF:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button onClick={handleViewPdf} disabled={isGenerating} className={className} variant={variant} size={size}>
      <DocumentMagnifyingGlassIcon className="h-4 w-4 mr-2" />
      {isGenerating ? 'Opening PDF...' : 'View PDF'}
    </Button>
  );
};

export default ViewPdfButton;
