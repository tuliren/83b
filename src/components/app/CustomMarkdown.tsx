import { List, Table, Text } from '@mantine/core';
import { FC, memo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';
import generatePDF, { Margin, Options, Resolution } from 'react-to-pdf';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface CustomMarkdownProps {
  text: string;
  textClassNames?: string[];
  fileName?: string;
  pdfOptions?: Omit<Options, 'filename'>;
}

const CustomMarkdown: FC<CustomMarkdownProps> = memo(
  ({ text, textClassNames, fileName = 'document.pdf', pdfOptions }) => {
    const targetRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleDownload = async () => {
      if (targetRef.current) {
        try {
          setIsGenerating(true);
          await generatePDF(targetRef, {
            filename: fileName,
            ...DEFAULT_OPTIONS,
            ...pdfOptions,
          });
        } catch (error) {
          console.error('Error generating PDF:', error);
        } finally {
          setIsGenerating(false);
        }
      }
    };

    return (
      <div>
        <Button disabled={isGenerating} onClick={handleDownload}>
          Download as PDF
        </Button>

        <div ref={targetRef}>
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
              table: (props) => (
                <Table
                  highlightOnHover
                  withColumnBorders
                  withTableBorder
                  className={props.className}
                  {...props.node?.properties}
                >
                  {props.children}
                </Table>
              ),
              thead: (props) => <Table.Thead className={props.className}>{props.children}</Table.Thead>,
              tbody: (props) => <Table.Tbody className={props.className}>{props.children}</Table.Tbody>,
              tr: (props) => <Table.Tr className={props.className}>{props.children}</Table.Tr>,
              td: (props) => <Table.Td className={props.className}>{props.children}</Table.Td>,
              th: (props) => <Table.Th className={props.className}>{props.children}</Table.Th>,
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
      </div>
    );
  }
);

CustomMarkdown.displayName = 'CustomMarkdown';

export default CustomMarkdown;

const DEFAULT_OPTIONS: Options = {
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
