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
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  useEffect(() => {
    async function loadPdf() {
      if (!id) return;

      try {
        const content = clientStorage.get(id as string);
        if (!content) {
          setError('PDF content not found');
          return;
        }

        setMarkdown(content);

        const response = await fetch('/api/get-pdf', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ markdown: content }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Response error:', {
            status: response.status,
            headers: Object.fromEntries(response.headers.entries()),
            body: errorText,
          });
          throw new Error(errorText || 'Failed to generate PDF');
        }

        const contentType = response.headers.get('content-type');
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        const blob = await response.blob();
        const pdfBlob = new Blob([blob], { type: 'application/pdf' });
        const url = URL.createObjectURL(pdfBlob);
        setPdfUrl(url);
      } catch (err) {
        console.error('Error loading PDF:', err);
        setError(err instanceof Error ? err.message : 'Failed to load PDF');
      } finally {
        setIsLoading(false);
      }
    }

    loadPdf();
  }, [id]);

  const handleDownload = async () => {
    if (!markdown) return;

    try {
      const response = await fetch('/api/get-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/pdf',
        },
        body: JSON.stringify({
          markdown,
          download: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate PDF');
      }

      const blob = await response.blob();
      const pdfBlob = new Blob([blob], { type: 'application/pdf' });
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'document.pdf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to download PDF');
    }
  };

  if (error) {
    return (
      <div className="p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading || !pdfUrl) {
    return (
      <div className="p-4">
        <p>Loading PDF...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>PDF Viewer</title>
        <meta
          httpEquiv="Content-Security-Policy"
          content="default-src 'self' blob: data:; style-src 'self' 'unsafe-inline';"
        />
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
          <iframe src={pdfUrl} className="w-full h-full border-none" title="PDF Viewer" />
        </div>
      </div>
    </>
  );
}
