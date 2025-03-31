import { FC, useEffect, useMemo, useState } from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import MarkdownPdf from '@/components/app/MarkdownPdf';
import { debounce } from 'lodash';
import { HeaderSection } from '@/components/app/types';

interface PdfViewerProps {
  content: string;
  debounceTime?: number;
  headers?: HeaderSection[];
  fitInOnePage?: boolean;
}

const PdfViewer: FC<PdfViewerProps> = ({ content, debounceTime = 2000, headers = [], fitInOnePage = false }) => {
  const [debouncedContent, setDebouncedContent] = useState(content);
  const [isUpdating, setIsUpdating] = useState(false);

  const debouncedUpdate = useMemo(
    () =>
      debounce((newContent: string) => {
        setDebouncedContent(newContent);
        setIsUpdating(false);
      }, debounceTime),
    [debounceTime]
  );

  useEffect(() => {
    setIsUpdating(true);
    debouncedUpdate(content);

    return () => {
      debouncedUpdate.cancel();
    };
  }, [content, debouncedUpdate]);

  return (
    <div className="relative flex flex-col m-0 p-0">
      {isUpdating && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-700" />
        </div>
      )}
      <PDFViewer className="w-full h-[95vh]">
        <MarkdownPdf text={debouncedContent} headers={headers} fitInOnePage={fitInOnePage} />
      </PDFViewer>
    </div>
  );
};

export default PdfViewer;
