import { Document } from '@react-pdf/renderer';
import { FC } from 'react';

import CustomPdfPage from '@/components/app/CustomPdfPage';
import { ContentPage } from '@/components/app/types';

interface CustomPdfFileProps {
  pages: ContentPage[];
}

const CustomPdfFile: FC<CustomPdfFileProps> = ({ pages }) => {
  return (
    <Document>
      {pages.map((page, index) => (
        <CustomPdfPage key={`pdf-page-${index}-${page.text.slice(0, 10)}`} {...page} />
      ))}
    </Document>
  );
};

export default CustomPdfFile;
