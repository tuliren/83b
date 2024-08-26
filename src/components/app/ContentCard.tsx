import { FC } from 'react';

import CustomMarkdown from '@/components/app/CustomMarkdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ContentCardProps {
  title: string;
  content: string;
  formData: Record<string, string>;
}

const ContentCard: FC<ContentCardProps> = ({ title, content, formData }) => {
  const replacePlaceholders = (text: string, data: Record<string, string>): string => {
    return text.replace(/{{(.*?)}}/g, (_, key) => {
      const trimmedKey = key.trim();
      return data?.[trimmedKey] != null && data[trimmedKey] !== '' ? data[trimmedKey].trim() : `{{${trimmedKey}}}`;
    });
  };

  const processedContent = replacePlaceholders(content, formData);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader className="pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <Separator />

      <CardContent className="pt-4">
        <CustomMarkdown text={processedContent} textClassNames={['text-sm', 'text-gray-700']} />
      </CardContent>
    </Card>
  );
};

export default ContentCard;
