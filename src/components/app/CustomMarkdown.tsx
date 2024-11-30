import { FC, memo, RefObject, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import { Margin, Options, Resolution } from 'react-to-pdf';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { cn } from '@/lib/utils';

interface CustomMarkdownProps {
  text: string;
  textClassNames?: string[];
  containerRef?: RefObject<HTMLDivElement>;
}

export const DEFAULT_PDF_OPTIONS: Options = {
  method: 'open',
  resolution: Resolution.HIGH,
  page: {
    margin: Margin.MEDIUM,
    format: 'letter',
    orientation: 'portrait',
  },
  canvas: {
    mimeType: 'image/png',
    qualityRatio: 1,
    useCORS: true,
  },
};

const CustomMarkdown: FC<CustomMarkdownProps> = memo(({ text, textClassNames, containerRef }) => {
  const defaultRef = useRef<HTMLDivElement>(null);
  const targetRef = containerRef || defaultRef;

  return (
    <div ref={targetRef} className="prose dark:prose-invert max-w-none">
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
        {text}
      </ReactMarkdown>
    </div>
  );
});

CustomMarkdown.displayName = 'CustomMarkdown';

export default CustomMarkdown;
