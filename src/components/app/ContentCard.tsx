import { FC } from 'react';

import BaseCard from '@/components/app/BaseCard';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import { FormDataMap } from '@/params/common';

interface ContentCardProps {
  title: string;
  content: string;
  formData: FormDataMap;
}

const ContentCard: FC<ContentCardProps> = ({ title, content, formData }) => {
  const replacePlaceholders = (text: string, data: FormDataMap): string => {
    return text.replace(/{{(.*?)}}/g, (_, key) => {
      const trimmedKey = key.trim();
      return data?.[trimmedKey] != null && data[trimmedKey] !== ''
        ? String(data[trimmedKey]).trim()
        : `{{${trimmedKey}}}`;
    });
  };

  const processedContent = replacePlaceholders(content, formData);

  return (
    <BaseCard title={title}>
      <CustomMarkdown text={processedContent} textClassNames={['text-sm', 'text-gray-700', 'pl-4', 'pr-6']} />
    </BaseCard>
  );
};

export default ContentCard;
