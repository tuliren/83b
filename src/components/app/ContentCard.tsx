import { FC, useRef } from 'react';
import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import { FormDataMap } from '@/params/common';
import { processTemplate } from '@/params/contentHelpers';
import PdfViewer from '@/components/app/PdfViewer';
import { HeaderSection } from '@/components/app/types';

interface ContentCardProps {
  title: string;
  content: string;
  formData: FormDataMap;
  view?: 'text' | 'pdf';
  headers?: HeaderSection[];
  fitInOnePage?: boolean;
}

const ContentCard: FC<ContentCardProps> = ({ title, content, formData, view = 'text', headers = [], fitInOnePage = false }) => {
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
      {view === 'pdf' && <PdfViewer content={processedContent} headers={headers} fitInOnePage={fitInOnePage} />}
    </BaseCard>
  );
};

export default ContentCard;
