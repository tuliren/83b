import { FC, useState } from 'react';
import * as React from 'react';
import { FormDataMap } from '../../params/common';
import { fillPdfForm } from '../../utils/pdfUtils';
import { Button } from '../ui/button';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

interface IrsPdfDownloadProps {
  formData: FormDataMap;
}

const IrsPdfDownload: FC<IrsPdfDownloadProps> = ({ formData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    try {
      setLoading(true);
      const pdfBytes = await fillPdfForm(formData);
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'form-15620-83b-election.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      className="flex items-center"
    >
      {loading ? (
        <>
          <div className="mr-2 animate-spin h-4 w-4 border-t-2 border-b-2 border-gray-900 rounded-full"></div>
          Generating...
        </>
      ) : error ? (
        'Error generating PDF'
      ) : (
        <>
          <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
          Download IRS Form 15620
        </>
      )}
    </Button>
  );
};

export default IrsPdfDownload;
