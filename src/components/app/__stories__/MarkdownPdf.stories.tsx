import { PDFViewer } from '@react-pdf/renderer';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import MarkdownPdf from '@/components/app/MarkdownPdf';
import { HEADERS, MARKDOWN_TEXT } from '@/components/app/__stories__/fixtures';

const meta: Meta<typeof MarkdownPdf> = {
  title: 'MarkdownPdf',
  component: MarkdownPdf,
  tags: ['autodocs'],
  decorators: [
    fn((Story) => (
      <PDFViewer className="w-full h-[95vh]">
        <Story />
      </PDFViewer>
    )),
  ],
};

export default meta;
type Story = StoryObj<typeof MarkdownPdf>;

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
