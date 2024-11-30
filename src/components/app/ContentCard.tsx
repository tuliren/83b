import { FC, useRef } from 'react';
import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import { FormDataMap } from '@/params/common';
import { processMarkdown } from '@/params/contentHelpers';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PdfViewer from '@/components/app/PdfViewer';

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
      <Tabs defaultValue="text" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="pdf">PDF</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <CustomMarkdown
            containerRef={contentRef}
            content={processedContent}
            textClassNames={['text-sm', 'text-gray-700']}
          />
        </TabsContent>

        <TabsContent value="pdf">
          <PdfViewer content={processedContent} />
        </TabsContent>
      </Tabs>
    </BaseCard>
  );
};

export default ContentCard;
