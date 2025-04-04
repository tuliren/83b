import { FC, useRef } from 'react';

import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import PdfViewer from '@/components/app/PdfViewer';
import { HeaderSection } from '@/components/app/types';
import { FormDataMap } from '@/params/common';
import { processTemplate } from '@/params/contentHelpers';

interface ContentCardProps {
  title: string;
  content: string;
  formData: FormDataMap;
  view?: 'text' | 'pdf';
  headers?: HeaderSection[];
  scalingFactor?: number;
}

const ContentCard: FC<ContentCardProps> = ({
  title,
  content,
  formData,
  view = 'text',
  headers = [],
  scalingFactor = 1,
}) => {
  const processedContent = processTemplate(content, formData);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <BaseCard title={title}>
      {view === 'text' && (
        <CustomMarkdown
          containerRef={contentRef}
          content={processedContent}
          textClassNames={['text-sm', 'text-gray-700']}
          headers={headers}
        />
      )}
      {view === 'pdf' && <PdfViewer content={processedContent} headers={headers} scalingFactor={scalingFactor} />}
    </BaseCard>
  );
};

export default ContentCard;
