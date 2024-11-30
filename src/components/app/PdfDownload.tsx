import { FC } from 'react';
import { BlobProvider } from '@react-pdf/renderer';
import { Button } from '../ui/button';
import { IconLoader2 } from '@tabler/icons-react';
import MarkdownPdf from './MarkdownPdf';

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
              <IconLoader2 className="mr-2 h-4 w-4 animate-spin" />
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
