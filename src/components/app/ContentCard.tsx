import { FC, useRef } from 'react';
import dynamic from 'next/dynamic';
import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import { FormDataMap } from '@/params/common';
import { processMarkdown } from '@/params/contentHelpers';
import { Button } from '../ui/button';
import { IconLoader2 } from '@tabler/icons-react';

const PdfDownload = dynamic(() => import('@/components/app/PdfDownload'), {
  ssr: false,
  loading: () => (
    <Button disabled>
      <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading PDF generator...
    </Button>
  ),
});

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
        <PdfDownload content={processedContent} title={title} />
      </div>

      <CustomMarkdown containerRef={contentRef} text={processedContent} textClassNames={['text-sm', 'text-gray-700']} />
    </BaseCard>
  );
};

export default ContentCard;
