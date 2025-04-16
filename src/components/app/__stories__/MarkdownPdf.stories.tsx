import { PDFViewer } from '@react-pdf/renderer';
import { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import CustomPdf from '@/components/app/CustomPdf';
import { HEADERS, MARKDOWN_TEXT } from '@/components/app/__stories__/fixtures';

const meta: Meta<typeof CustomPdf> = {
  title: 'MarkdownPdf',
  component: CustomPdf,
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
type Story = StoryObj<typeof CustomPdf>;

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
