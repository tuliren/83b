import { FC, Fragment, ReactNode } from 'react';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import type { Root, RootContent } from 'mdast';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { HeaderSection } from './types';
import { Style } from '@react-pdf/types';

const NORMAL_FONT = 'Helvetica';
const BOLD_FONT = 'Helvetica-Bold';
const ITALIC_FONT = 'Helvetica-Oblique';
const LINE_HEIGHT = 0.9;
const FONT_SIZE = 10;
const TITLE_MARGIN_TOP = 3;
const TITLE_MARGIN_BOTTOM = 12;
const PARAGRAPH_MARGIN_TOP = 2;
const PARAGRAPH_MARGIN_BOTTOM = 4;

const hyphenationCallback = (word: string) => {
  return [word];
};

Font.registerHyphenationCallback(hyphenationCallback);

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 40,
    paddingVertical: 20,
    fontFamily: NORMAL_FONT,
    fontSize: FONT_SIZE,
    lineHeight: LINE_HEIGHT,
  },
  h1: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: TITLE_MARGIN_TOP,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h2: {
    fontSize: 24,
    marginTop: TITLE_MARGIN_TOP,
    marginBottom: TITLE_MARGIN_BOTTOM,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h3: {
    fontSize: 22,
    marginTop: TITLE_MARGIN_TOP,
    marginBottom: TITLE_MARGIN_BOTTOM,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h4: {
    fontSize: 20,
    marginTop: TITLE_MARGIN_TOP,
    marginBottom: TITLE_MARGIN_BOTTOM,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h5: {
    fontSize: 18,
    marginTop: TITLE_MARGIN_TOP,
    marginBottom: TITLE_MARGIN_BOTTOM,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h6: {
    fontSize: 16,
    marginTop: TITLE_MARGIN_TOP,
    marginBottom: TITLE_MARGIN_BOTTOM,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  paragraph: {
    marginTop: PARAGRAPH_MARGIN_TOP,
    marginBottom: PARAGRAPH_MARGIN_BOTTOM,
    lineHeight: LINE_HEIGHT,
  },
  list: {
    marginVertical: 0,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listItemContent: {
    flex: 1,
    margin: 0,
    padding: 0,
    paddingLeft: 2,
    lineHeight: LINE_HEIGHT,
  },
  listItemMarker: {
    marginTop: PARAGRAPH_MARGIN_TOP,
    paddingRight: 2,
  },
  table: {
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderBottomWidth: 0,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    padding: 8,
    fontFamily: BOLD_FONT,
  },
  tableCell: {
    padding: 8,
    flex: 1,
  },
  strong: {
    fontFamily: BOLD_FONT,
  },
  emphasis: {
    fontFamily: ITALIC_FONT,
  },
  headerContainer: {
    flexDirection: 'column',
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 8,
  },
  headerSection: {
    flexDirection: 'column',
  },
  headerTextLeft: {
    textAlign: 'left',
  },
  headerTextCenter: {
    textAlign: 'center',
  },
  headerTextRight: {
    textAlign: 'right',
  },
});

interface MarkdownPdfProps {
  text: string;
  headers?: HeaderSection[];
}

const renderNode = (node: RootContent, parentType?: string): ReactNode => {
  switch (node.type) {
    case 'heading': {
      const HeadingStyle = styles[`h${node.depth}` as keyof typeof styles];
      return (
        <Text style={HeadingStyle}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );
    }

    case 'paragraph': {
      return (
        <Text style={styles.paragraph}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );
    }

    case 'list': {
      return (
        <View style={styles.list}>
          {(node.children as RootContent[]).map((child, i) => (
            <View key={i} style={styles.listItemContainer}>
              <Text style={styles.listItemMarker}>{node.ordered ? `${i + 1}.` : '•'}</Text>
              <View style={styles.listItemContent}>{renderNode(child, 'listItem')}</View>
            </View>
          ))}
        </View>
      );
    }

    case 'listItem': {
      return (node.children as RootContent[]).map((child, i) => (
        <Fragment key={i}>{renderNode(child, 'listItem')}</Fragment>
      ));
    }

    case 'table': {
      return (
        <View style={styles.table}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </View>
      );
    }

    case 'tableRow': {
      return (
        <View style={styles.tableRow}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </View>
      );
    }

    case 'tableCell': {
      return (
        <Text style={parentType === 'tableHeader' ? styles.tableHeader : styles.tableCell}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );
    }

    case 'break': {
      return <Text style={styles.paragraph}>{'\n'}</Text>;
    }

    case 'html': {
      if (node.value.trim().startsWith('<br')) {
        return <Text style={styles.paragraph}>{'\n'}</Text>;
      }
      return node.value;
    }

    case 'text': {
      return node.value;
    }

    case 'strong': {
      return (
        <Text style={styles.strong}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );
    }

    case 'emphasis': {
      return (
        <Text style={styles.emphasis}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );
    }

    default: {
      if ((node as any).children) {
        return ((node as any).children as RootContent[]).map((child, i) => (
          <Fragment key={i}>{renderNode(child)}</Fragment>
        ));
      }
      return null;
    }
  }
};

const renderHeaderSection = (section: HeaderSection, index: number) => {
  const alignmentStyle =
    section.alignment === 'center'
      ? styles.headerTextCenter
      : section.alignment === 'right'
        ? styles.headerTextRight
        : styles.headerTextLeft;

  const customStyle: Style = {
    ...alignmentStyle,
  };
  if (section.color) {
    customStyle.color = section.color;
  }
  if (section.fontSize) {
    customStyle.fontSize = section.fontSize;
  }
  if (section.bold) {
    customStyle.fontFamily = BOLD_FONT;
  }

  return (
    <View key={index} style={{ ...styles.headerSection, alignItems: section.alignment === 'center' ? 'center' : section.alignment === 'right' ? 'flex-end' : 'flex-start' }}>
      {section.text.split('\n').map((text, textIndex) => (
        <Text key={`header-text-${textIndex}`} style={customStyle}>{text}</Text>
      ))}
    </View>
  );
};

const MarkdownPdf: FC<MarkdownPdfProps> = ({ text, headers = [] }) => {
  const processor = unified()
    // remark processes markdown
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    // rehype processes html
    .use(rehypeRaw)
    .use(rehypeSanitize)
    .use(rehypeStringify);
  const ast = processor.parse(text) as Root;

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {headers.length > 0 && (
          <View style={styles.headerContainer}>
            {headers.map((section, index) => renderHeaderSection(section, index))}
          </View>
        )}
        {ast.children.map((node, i) => (
          <Fragment key={i}>{renderNode(node)}</Fragment>
        ))}
      </Page>
    </Document>
  );
};

export default MarkdownPdf;
