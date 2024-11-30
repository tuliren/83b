import type { NextApiRequest, NextApiResponse } from 'next';
import puppeteer from 'puppeteer';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { markdown } = req.body;

    if (!markdown) {
      return res.status(400).json({ message: 'Markdown content is required' });
    }

    // Get the base URL from request headers
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const baseUrl = `${protocol}://${host}`;

    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: 'new',
    });

    try {
      const page = await browser.newPage();

      // Set content directly instead of navigation
      await page.setContent(
        `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>PDF Generation</title>
            <style>
              @page {
                margin: 0;
              }
              body {
                margin: 40px;
              }
            </style>
          </head>
          <body>
            <div id="content"></div>
            <script>
              document.getElementById('content').innerHTML = 
                decodeURIComponent("${encodeURIComponent(markdown)}");
            </script>
          </body>
        </html>
      `,
        {
          waitUntil: 'networkidle0',
        }
      );

      // Generate PDF
      const pdf = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '40px',
          right: '40px',
          bottom: '40px',
          left: '40px',
        },
      });

      // Send the PDF
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename=document.pdf');
      res.send(pdf);
    } finally {
      await browser.close();
    }
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({
      message: 'Error generating PDF',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};
