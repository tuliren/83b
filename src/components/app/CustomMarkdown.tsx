import { List, Text } from '@mantine/core';
import { FC, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { cn } from '@/lib/utils';

interface CustomMarkdownProps {
  text: string;
  textClassNames?: string[];
}

const CustomMarkdown: FC<CustomMarkdownProps> = memo(({ text, textClassNames }) => {
  return (
    <ReactMarkdown
      components={{
        p: (props) => <Text className={cn('mt-3', textClassNames)}>{props.children}</Text>,
        ol: (props) => (
          <List type="ordered" className="list-decimal mt-3">
            {props.children}
          </List>
        ),
        ul: (props) => <List className="list-none list-inside mt-3">{props.children}</List>,
        li: (props) => <List.Item className={cn(textClassNames)}>{props.children}</List.Item>,
        h1: (props) => <Text className={cn(textClassNames, 'text-2xl', 'font-bold')}>{props.children}</Text>,
        h2: (props) => <Text className={cn(textClassNames, 'text-xl', 'font-bold')}>{props.children}</Text>,
        h3: (props) => <Text className={cn(textClassNames, 'text-lg', 'font-bold')}>{props.children}</Text>,
      }}
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[
        rehypeRaw,
        rehypeSanitize,
        [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
      ]}
    >
      {text}
    </ReactMarkdown>
  );
});

CustomMarkdown.displayName = 'CustomMarkdown';

export default CustomMarkdown;
