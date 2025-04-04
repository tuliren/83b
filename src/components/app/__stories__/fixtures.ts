import { HeaderSection } from '@/components/app/types';

export const MARKDOWN_TEXT = `# Hello World
This is a test of the Markdown component with external [link](https://www.google.com).

<details>
<summary>(click to see details)</summary>
Lorem Ipsum is simply dummy text of the printing and typesetting industry.
</details>

## Titles

This is a paragraph.

### Level 3 title

This is a paragraph.

#### Level 4 title

This is a paragraph.

##### Level 5 title

This is a paragraph.
###### Level 6 title

This is a paragraph.

<br />

## Lists
1. First
2. Second
3. Third
   - Sublist 1
   - Sublist 2
      - Sublist 2.1

<br />

## TODOs
- [ ] Task 1
- [ ] Task 2
  - [x] Subtask 2.1

<br />

## Table
| Column 1 | Column 2|
| --- | --- |
| Value 1 | Value 2 |
| Value 3 | Value 4 |
`;

export const HEADERS: HeaderSection[] = [
  {
    text: 'CONFIDENTIAL',
    alignment: 'left',
    color: '#FF0000',
    bold: true,
  },
  {
    text: 'Markdown Example',
    alignment: 'center',
    fontSize: 14,
  },
  {
    text: 'Page 1 of 1',
    alignment: 'right',
    color: '#666666',
  },
];
