import { ColorSchemeScript } from '@mantine/core';
import Document, { Head, Html, Main, NextScript } from 'next/document';

export default class _Document extends Document {
  render() {
    return (
      <Html className="h-full scroll-smooth antialiased">
        <Head>
          <ColorSchemeScript defaultColorScheme="auto" />
        </Head>
        <body className="flex h-full flex-col">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
