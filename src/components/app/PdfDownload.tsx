import { FC } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { Button } from '../ui/button';
import MarkdownPdf from './MarkdownPdf';
import { ArrowPathIcon } from '@heroicons/react/24/outline';

interface PdfDownloadProps {
  content: string;
  title: string;
}

const PdfDownload: FC<PdfDownloadProps> = ({ content, title }) => {
  return (
    <BlobProvider document={<MarkdownPdf text={content} />}>
      {({ blob, url, loading, error }) => (
        <Button
          disabled={loading || !!error}
          onClick={() => {
            if (url) {
              const link = document.createElement('a');
              link.href = url;
              link.download = `${title.toLowerCase().replace(/\s+/g, '-')}.pdf`;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }
          }}
        >
          {loading ? (
            <>
              <ArrowPathIcon className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : error ? (
            'Error generating PDF'
          ) : (
            'Download as PDF'
          )}
        </Button>
      )}
    </BlobProvider>
  );
};

export default PdfDownload;