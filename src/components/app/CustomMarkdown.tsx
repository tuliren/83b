import { CSSProperties, FC, Fragment, RefObject, memo, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

import { HeaderSection } from '@/components/app/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface CustomMarkdownProps {
  content: string;
  textClassNames?: string[];
  containerRef?: RefObject<HTMLDivElement>;
  headers?: HeaderSection[];
}

const CustomMarkdown: FC<CustomMarkdownProps> = memo(({ content, textClassNames, containerRef, headers = [] }) => {
  const defaultRef = useRef<HTMLDivElement>(null);
  const targetRef = containerRef || defaultRef;

  const renderHeaderSection = (section: HeaderSection) => {
    const alignmentClass =
      section.alignment === 'center' ? 'text-center' : section.alignment === 'right' ? 'text-right' : 'text-left';

    const styleProps: CSSProperties = {};
    if (section.color) {
      styleProps.color = section.color;
    }
    if (section.fontSize) {
      styleProps.fontSize = `${section.fontSize}px`;
    }

    return (
      <div className={cn('flex flex-col', alignmentClass)}>
        {section.text.split('\n').map((text, index) => (
          <p key={`header-text-${index}`} className={cn(section.bold ? 'font-bold' : '', 'mb-0')} style={styleProps}>
            {text}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div ref={targetRef} className="prose dark:prose-invert max-w-none">
      {headers.length > 0 && (
        <div className="flex flex-col space-y-1 mb-5 pb-2 border-b border-gray-200">
          {headers.map((section, index) => (
            <Fragment key={index}>{renderHeaderSection(section)}</Fragment>
          ))}
        </div>
      )}
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mt-6 first:mt-0">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight mt-4 first:mt-0">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight mt-3 first:mt-0">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mt-2 first:mt-0">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="scroll-m-20 text-lg font-semibold tracking-tight mt-1 first:mt-0">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="scroll-m-20 text-base font-semibold tracking-tight mt-0.5 first:mt-0">{children}</h6>
          ),
          p: ({ children }) => <p className={cn('mt-3 leading-7', textClassNames)}>{children}</p>,
          ol: ({ children }) => <ol className="list-decimal pl-6">{children}</ol>,
          ul: ({ children }) => <ul className="list-disc pl-6">{children}</ul>,
          li: ({ children }) => <li className={cn('leading-7', textClassNames)}>{children}</li>,
          table: ({ children }) => (
            <div className="mb-2 w-full overflow-y-auto">
              <Table>{children}</Table>
            </div>
          ),
          thead: ({ children }) => <TableHeader>{children}</TableHeader>,
          tbody: ({ children }) => <TableBody>{children}</TableBody>,
          tr: ({ children }) => <TableRow>{children}</TableRow>,
          td: ({ children }) => <TableCell>{children}</TableCell>,
          th: ({ children }) => <TableHead className="h-12">{children}</TableHead>,
        }}
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[
          rehypeRaw,
          rehypeSanitize,
          [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }],
        ]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

CustomMarkdown.displayName = 'CustomMarkdown';

export default CustomMarkdown;
