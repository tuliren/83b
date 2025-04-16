import { Document, PDFViewer } from '@react-pdf/renderer';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import CustomPdfPage from '@/components/app/CustomPdfPage';
import { HEADERS, MARKDOWN_TEXT } from '@/components/app/__stories__/fixtures';

const meta: Meta<typeof CustomPdfPage> = {
  title: 'CustomPdfPage',
  component: CustomPdfPage,
  tags: ['autodocs'],
  decorators: [
    fn((Story) => (
      <PDFViewer className="w-full h-[95vh]">
        <Document>
          <Story />
        </Document>
      </PDFViewer>
    )),
  ],
};

export default meta;
type Story = StoryObj<typeof CustomPdfPage>;

export const Primary: Story = {
  args: {
    text: MARKDOWN_TEXT,
    headers: HEADERS,
  },
};

export const Scaled: Story = {
  args: {
    text: MARKDOWN_TEXT,
    headers: HEADERS,
    scalingFactor: 0.5,
  },
};
