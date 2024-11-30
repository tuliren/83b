import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import CustomMarkdown from '@/components/app/CustomMarkdown';

const PdfRenderer = () => {
  const router = useRouter();
  const [content, setContent] = useState('');

  useEffect(() => {
    if (router.query.content) {
      setContent(decodeURIComponent(router.query.content as string));
    }
  }, [router.query]);

  // Add specific styles for PDF rendering
  return (
    <>
      <Head>
        <title>PDF Renderer</title>
        <style>{`
          @page {
            size: A4;
            margin: 0;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        `}</style>
      </Head>
      <div className="min-h-screen bg-white">
        <CustomMarkdown text={content} />
      </div>
    </>
  );
};

export default PdfRenderer;
