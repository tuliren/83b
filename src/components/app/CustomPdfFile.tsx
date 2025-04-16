import { Document } from '@react-pdf/renderer';
import { FC } from 'react';

import CustomPdfPage, { CustomPdfPageProps } from '@/components/app/CustomPdfPage';

interface CustomPdfFileProps {
  pages: CustomPdfPageProps[];
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
