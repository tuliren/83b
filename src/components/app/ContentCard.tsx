import { FC } from 'react';

import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import { FormDataMap } from '@/params/common';
import { processMarkdown } from '@/params/contentHelpers';

interface ContentCardProps {
  title: string;
  content: string;
  formData: FormDataMap;
}

const ContentCard: FC<ContentCardProps> = ({ title, content, formData }) => {
  const processedContent = processMarkdown(content, formData);

  return (
    <BaseCard title={title}>
      <CustomMarkdown text={processedContent} textClassNames={['text-sm', 'text-gray-700', 'pl-4', 'pr-6']} />
    </BaseCard>
  );
};

export default ContentCard;
