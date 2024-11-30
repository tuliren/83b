import type { NextApiRequest, NextApiResponse } from 'next';
import { launch } from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let browser;
  try {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).json({ message: 'Markdown content is required' });
    }

    browser = await launch({
      headless: true,
    });

    const page = await browser.newPage();

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const url = `${baseUrl}/pdf-renderer?content=${encodeURIComponent(markdown)}`;

    await page.goto(url, {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await page.waitForSelector('[data-pdf-content="ready"]', {
      timeout: 10000,
    });

    const pdf = await page.pdf({
      format: 'LETTER',
      printBackground: true,
      margin: {
        top: '40px',
        right: '40px',
        bottom: '40px',
        left: '40px',
      },
      preferCSSPageSize: true,
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Length', pdf.length.toString());
    res.setHeader('Content-Encoding', 'identity');
    res.status(200).send(Buffer.from(pdf));
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      message: 'Error generating PDF',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
