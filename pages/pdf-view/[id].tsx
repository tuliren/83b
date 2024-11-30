import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';
import { clientStorage } from '@/lib/client-storage';

export default function PdfViewer() {
  const router = useRouter();
  const { id } = router.query;
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      const content = clientStorage.get(id);
      if (!content) {
        setError('PDF content not found');
      } else {
        setMarkdown(content);
      }
      setIsLoading(false);
    }
  }, [id]);

  const handleDownload = async () => {
    if (!markdown) return;

    try {
      const response = await fetch(`/api/get-pdf/${id}?download=true`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ markdown }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError('Failed to download PDF');
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading || !id || !markdown) {
    return (
      <div className="p-4">
        <p>Loading...</p>
      </div>
    );
  }

  const viewerUrl = `/api/get-pdf/${id}?markdown=${encodeURIComponent(markdown)}`;

  return (
    <>
      <Head>
        <title>PDF Viewer</title>
        <style>{`
          html, body {
            margin: 0;
            padding: 0;
            height: 100vh;
            overflow: hidden;
          }
        `}</style>
      </Head>
      <div className="flex flex-col h-screen">
        <div className="flex items-center justify-end p-4 border-b">
          <Button onClick={handleDownload} variant="outline" size="sm">
            <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
        <div className="flex-1">
          <iframe src={viewerUrl} className="w-full h-full border-none" title="PDF Viewer" />
        </div>
      </div>
    </>
  );
}
