import { FC } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import MarkdownPdf from '@/components/app/MarkdownPdf';

interface PdfViewerProps {
  content: string;
}

const PdfViewer: FC<PdfViewerProps> = ({ content }) => {
  return (
    <div className="flex flex-col m-0 p-0">
      <PDFViewer className="w-full h-[95vh]">
        <MarkdownPdf text={content} />
      </PDFViewer>
    </div>
  );
};

export default PdfViewer;
