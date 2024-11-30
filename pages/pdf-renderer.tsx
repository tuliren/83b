import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CustomMarkdown from '@/components/app/CustomMarkdown';
import Head from 'next/head';

const PdfRenderer = () => {
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (router.query.content) {
      setContent(decodeURIComponent(router.query.content as string));
      // Give time for styles to be applied
      setTimeout(() => setIsReady(true), 1000);
    }
  }, [router.query]);

  return (
    <>
      <Head>
        <title>PDF Renderer</title>
        <style>{`
          @page {
            margin: 0;
          }
          body {
            margin: 0;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          /* Force light theme for PDF generation */
          :root {
            color-scheme: light;
          }
          /* Ensure proper rendering of Tailwind prose classes */
          .prose {
            max-width: none !important;
          }
          /* Add any additional print-specific styles here */
          @media print {
            html, body {
              height: 100vh;
              margin: 0 !important;
              padding: 0 !important;
              overflow: hidden;
            }
            /* Force light theme colors for PDF */
            :root {
              --background: 0 0% 100%;
              --foreground: 240 10% 3.9%;
              --card: 0 0% 100%;
              --card-foreground: 240 10% 3.9%;
              --popover: 0 0% 100%;
              --popover-foreground: 240 10% 3.9%;
              --primary: 240 5.9% 10%;
              --primary-foreground: 0 0% 98%;
              --secondary: 240 4.8% 95.9%;
              --secondary-foreground: 240 5.9% 10%;
              --muted: 240 4.8% 95.9%;
              --muted-foreground: 240 3.8% 46.1%;
              --accent: 240 4.8% 95.9%;
              --accent-foreground: 240 5.9% 10%;
              --destructive: 0 84.2% 60.2%;
              --destructive-foreground: 0 0% 98%;
              --border: 240 5.9% 90%;
              --input: 240 5.9% 90%;
              --ring: 240 10% 3.9%;
            }
          }
        `}</style>
      </Head>
      <main className="min-h-screen bg-white p-10" data-pdf-content={isReady ? 'ready' : 'loading'}>
        <div className="max-w-none prose prose-slate">
          <CustomMarkdown text={content} />
        </div>
      </main>
    </>
  );
};

export default PdfRenderer;
