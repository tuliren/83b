import PlausibleProvider from 'next-plausible';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import '../styles/globals.css';

export default function MyApp({ Component, pageProps }: AppProps) {
  // Uses NEXT_PUBLIC_VERCEL_ENV instead of NODE_ENV so we can exclude previews from analytics collection.
  // see https://vercel.com/docs/concepts/projects/environment-variables#system-environment-variables
  const enableAnalytics = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production';

  return (
    <>
      <Head>
        <title>Section 83(b) Election</title>
        <meta name="description" content="Generate 83(b) election with ease" />
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="icon" href="/receipt-2.png" />
      </Head>

      <PlausibleProvider domain="83b.page" enabled={enableAnalytics}>
        <Component {...pageProps} />
      </PlausibleProvider>
    </>
  );
}
