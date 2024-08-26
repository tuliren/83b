import { FC, ReactNode } from 'react';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface BaseCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

const BaseCard: FC<BaseCardProps> = ({ title, description, children }) => {
  return (
    <Card className="w-full">
      <CardHeader className="py-6">
        <CardTitle>{title}</CardTitle>
        {description != null && <CardDescription>{description}</CardDescription>}
      </CardHeader>

      <Separator />

      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
};

export default BaseCard;
