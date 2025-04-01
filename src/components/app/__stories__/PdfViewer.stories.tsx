import { Meta, StoryObj } from '@storybook/react';

import PdfViewer from '@/components/app/PdfViewer';
import { MARKDOWN_TEXT } from '@/components/app/__stories__/fixtures';

const meta: Meta<typeof PdfViewer> = {
  title: 'PdfViewer',
  component: PdfViewer,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof PdfViewer>;

export const Primary: Story = {
  args: {
    content: MARKDOWN_TEXT,
  },
};
