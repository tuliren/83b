import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { PDFViewer } from '@react-pdf/renderer';
import { debounce } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';

import MarkdownPdf from '@/components/app/MarkdownPdf';
import { HeaderSection } from '@/components/app/types';

interface PdfViewerProps {
  content: string;
  debounceTime?: number;
  headers?: HeaderSection[];
  scalingFactor?: number;
}

const PdfViewer: FC<PdfViewerProps> = ({ content, debounceTime = 2000, headers = [], scalingFactor = 1 }) => {
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
        <MarkdownPdf text={debouncedContent} headers={headers} scalingFactor={scalingFactor} />
      </PDFViewer>
    </div>
  );
};

export default PdfViewer;
