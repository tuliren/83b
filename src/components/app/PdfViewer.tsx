import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { PDFViewer } from '@react-pdf/renderer';
import { debounce } from 'lodash';
import { FC, useEffect, useMemo, useState } from 'react';

import CustomPdfFile from '@/components/app/CustomPdfFile';
import { ContentPage } from '@/components/app/types';

interface PdfViewerProps {
  pages: ContentPage[];
  debounceTime?: number;
}

const PdfViewer: FC<PdfViewerProps> = ({ pages, debounceTime = 1000 }) => {
  const [debouncedPages, setDebouncedPages] = useState(pages);
  const [isUpdating, setIsUpdating] = useState(false);

  const debouncedUpdate = useMemo(
    () =>
      debounce((newPages: ContentPage[]) => {
        setDebouncedPages(newPages);
        setIsUpdating(false);
      }, debounceTime),
    [debounceTime]
  );

  useEffect(() => {
    setIsUpdating(true);
    debouncedUpdate(pages);

    return () => {
      debouncedUpdate.cancel();
    };
  }, [pages, debouncedUpdate]);

  return (
    <div className="relative flex flex-col m-0 p-0">
      {isUpdating && (
        <div className="absolute inset-0 bg-black/10 flex items-center justify-center z-10">
          <ArrowPathIcon className="w-8 h-8 animate-spin text-gray-700" />
        </div>
      )}
      <PDFViewer className="w-full h-[95vh]">
        <CustomPdfFile pages={debouncedPages} />
      </PDFViewer>
    </div>
  );
};

export default PdfViewer;
