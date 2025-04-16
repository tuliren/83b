import { PDFViewer } from '@react-pdf/renderer';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import CustomPdfFile from '@/components/app/CustomPdfFile';
import { HEADERS, MARKDOWN_TEXT } from '@/components/app/__stories__/fixtures';

const meta: Meta<typeof CustomPdfFile> = {
  title: 'CustomPdfFile',
  component: CustomPdfFile,
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
type Story = StoryObj<typeof CustomPdfFile>;

export const Primary: Story = {
  args: {
    pages: [
      {
        title: 'First Page',
        text: MARKDOWN_TEXT,
        headers: HEADERS,
      },
      {
        title: 'Duplicated Page',
        text: MARKDOWN_TEXT,
        headers: HEADERS,
      },
    ],
  },
};
