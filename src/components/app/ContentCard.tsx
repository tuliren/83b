import { FC, useRef, useState } from 'react';

import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown, { DEFAULT_PDF_OPTIONS } from '@/components/app/CustomMarkdown';
import { FormDataMap } from '@/params/common';
import { processMarkdown } from '@/params/contentHelpers';
import generatePDF from 'react-to-pdf';
import { Button } from '../ui/button';

interface ContentCardProps {
  title: string;
  content: string;
  formData: FormDataMap;
}

const ContentCard: FC<ContentCardProps> = ({ title, content, formData }) => {
  const processedContent = processMarkdown(content, formData);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    if (contentRef.current) {
      try {
        setIsGenerating(true);
        await generatePDF(contentRef, {
          filename: 'document.pdf',
          ...DEFAULT_PDF_OPTIONS,
        });
      } catch (error) {
        console.error('Error generating PDF:', error);
      } finally {
        setIsGenerating(false);
      }
    }
  };

  return (
    <BaseCard title={title}>
      <div className="flex justify-start">
        <Button disabled={isGenerating} onClick={handleDownload}>
          {isGenerating ? 'Generating...' : 'Download as PDF'}
        </Button>
      </div>

      <CustomMarkdown containerRef={contentRef} text={processedContent} textClassNames={['text-sm', 'text-gray-700']} />
    </BaseCard>
  );
};

export default ContentCard;
