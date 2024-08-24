import { StyleSheet, css } from 'aphrodite';
import React, { FC, memo } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface CustomMarkdownProps {
  text: string;
}

const CustomMarkdown: FC<CustomMarkdownProps> = memo(({ text }) => {
  return (
    <ReactMarkdown
      components={{
        p: (props) => <p className={css(styles.p)} {...props} />,
      }}
      rehypePlugins={[
        remarkGfm,
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

const styles = StyleSheet.create({
  p: {
    marginTop: '12px',
    marginBottom: '12px',
    ':first-of-type': {
      marginTop: '3px',
    },
    ':last-of-type': {
      marginBottom: '3px',
    },
  },
});
