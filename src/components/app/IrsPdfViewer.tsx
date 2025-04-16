import { FC, useEffect, useState } from 'react';
import * as React from 'react';
import { FormDataMap } from '../../params/common';
import { fillPdfForm } from '../../utils/pdfUtils';
import BaseCard from '../app/BaseCard';

interface IrsPdfViewerProps {
  formData: FormDataMap;
}

const IrsPdfViewer: FC<IrsPdfViewerProps> = ({ formData }) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generatePdf = async () => {
      try {
        setLoading(true);
        const pdfBytes = await fillPdfForm(formData);
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
        setError(null);
      } catch (err) {
        console.error('Error generating PDF:', err);
        setError('Failed to generate PDF');
      } finally {
        setLoading(false);
      }
    };

    generatePdf();

    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [formData]);

  if (loading) {
    return (
      <BaseCard title="Loading PDF">
        <div className="flex justify-center items-center h-[95vh]">
          <div className="animate-spin h-10 w-10 border-t-2 border-b-2 border-gray-900 rounded-full"></div>
        </div>
      </BaseCard>
    );
  }

  if (error) {
    return (
      <BaseCard title="Error">
        <div className="text-red-500">{error}</div>
      </BaseCard>
    );
  }

  return (
    <BaseCard title="Form 15620 - Section 83(b) Election">
      <div className="w-full h-[95vh]">
        <iframe
          src={pdfUrl || ''}
          className="w-full h-full"
          title="IRS Form 15620"
        />
      </div>
    </BaseCard>
  );
};

export default IrsPdfViewer;
