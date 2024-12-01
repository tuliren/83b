import { FC, useRef } from 'react';
import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import { FormDataMap } from '@/params/common';
import { processMarkdown } from '@/params/contentHelpers';
import PdfViewer from '@/components/app/PdfViewer';

interface ContentCardProps {
  title: string;
  content: string;
  formData: FormDataMap;
  view?: 'text' | 'pdf';
}

const ContentCard: FC<ContentCardProps> = ({ title, content, formData, view = 'text' }) => {
  const processedContent = processMarkdown(content, formData);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <BaseCard title={title}>
      {view === 'text' && (
        <CustomMarkdown
          containerRef={contentRef}
          content={processedContent}
          textClassNames={['text-sm', 'text-gray-700']}
        />
      )}
      {view === 'pdf' && <PdfViewer content={processedContent} />}
    </BaseCard>
  );
};

export default ContentCard;
