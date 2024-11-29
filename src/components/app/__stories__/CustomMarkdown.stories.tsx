import { Meta, StoryObj } from '@storybook/react';
import CustomMarkdown from '@/components/app/CustomMarkdown';

const meta: Meta<typeof CustomMarkdown> = {
  title: 'CustomMarkdown',
  component: CustomMarkdown,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CustomMarkdown>;

const text = `# Hello World
This is a test of the Markdown component with external [link](https://www.google.com).

<details>
<summary>(click to see details)</summary>
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
</details>

## Titles
### Level 3 title
#### Level 4 title
##### Level 5 title
###### Level 6 title

## TODOs
- [ ] Task 1
- [ ] Task 2
  - [x] Subtask 2.1
  - [x] Subtask 2.2

## Table
| Column 1 | Column 2|
| --- | --- |
| Value 1 | Value 2 |
| Value 3 | Value 4 |
`;

export const Primary: Story = {
  args: {
    text,
  },
};