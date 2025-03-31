import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import MarkdownPdf from '@/components/app/MarkdownPdf';
import { HEADERS, MARKDOWN_TEXT } from '@/components/app/__stories__/fixtures';
import { PDFViewer } from '@react-pdf/renderer';

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
