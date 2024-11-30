import { FC, useRef } from 'react';
import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import { FormDataMap } from '@/params/common';
import { processMarkdown } from '@/params/contentHelpers';
import ViewPdfButton from '@/components/app/ViewPdfButton';

interface ContentCardProps {
  title: string;
  content: string;
  formData: FormDataMap;
}

const ContentCard: FC<ContentCardProps> = ({ title, content, formData }) => {
  const processedContent = processMarkdown(content, formData);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <BaseCard title={title}>
      <div className="flex justify-start mb-4">
        <ViewPdfButton markdown={processedContent} variant="outline" />
      </div>

      <CustomMarkdown containerRef={contentRef} text={processedContent} textClassNames={['text-sm', 'text-gray-700']} />
    </BaseCard>
  );
};

export default ContentCard;
