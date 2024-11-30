import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Accept both GET and POST requests
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let browser;
  try {
    // Get markdown from query param for GET requests, body for POST requests
    let markdown: string | undefined;
    if (req.method === 'GET') {
      markdown = req.query.markdown as string;
    } else {
      markdown = req.body.markdown;
    }

    if (!markdown) {
      return res.status(400).json({ message: 'Markdown content is required' });
    }

    const download = req.query.download === 'true';

    browser = await puppeteer.launch({
      headless: true,
    });

    const page = await browser.newPage();

    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    const url = `${baseUrl}/pdf-renderer?content=${encodeURIComponent(markdown)}`;
    await page.goto(url, {
      waitUntil: 'networkidle0',
    });

    await page.waitForSelector('[data-pdf-content="ready"]', { timeout: 5000 });

    await page.screenshot({
      path: './logs/debug-screenshot.png',
      fullPage: true,
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
    res.setHeader('Content-Length', pdf.length);

    if (download) {
      res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
    } else {
      res.setHeader('Content-Disposition', 'inline; filename="document.pdf"');
    }

    res.send(pdf);
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
