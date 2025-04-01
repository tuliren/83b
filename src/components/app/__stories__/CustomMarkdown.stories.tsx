import { Meta, StoryObj } from '@storybook/react';

import CustomMarkdown from '@/components/app/CustomMarkdown';
import { MARKDOWN_TEXT } from '@/components/app/__stories__/fixtures';

const meta: Meta<typeof CustomMarkdown> = {
  title: 'CustomMarkdown',
  component: CustomMarkdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomMarkdown>;

export const Primary: Story = {
  args: {
    content: MARKDOWN_TEXT,
  },
};
