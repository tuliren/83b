import { FC, Fragment, ReactNode } from 'react';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { RootContent, Root } from 'mdast';

const NORMAL_FONT = 'Helvetica';
const BOLD_FONT = 'Helvetica-Bold';
const ITALIC_FONT = 'Helvetica-Oblique';
const LINE_HEIGHT = 1.0;
const FONT_SIZE = 14;

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
    marginTop: 12,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h2: {
    fontSize: 24,
    marginTop: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h3: {
    fontSize: 22,
    marginTop: 10,
    marginBottom: 4,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h4: {
    fontSize: 20,
    marginTop: 10,
    marginBottom: 4,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h5: {
    fontSize: 18,
    marginTop: 10,
    marginBottom: 4,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  h6: {
    fontSize: 16,
    marginTop: 10,
    marginBottom: 4,
    fontFamily: BOLD_FONT,
    lineHeight: LINE_HEIGHT,
  },
  paragraph: {
    marginTop: 12,
    lineHeight: LINE_HEIGHT,
  },
  list: {
    marginVertical: 2,
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  listItemContent: {
    flex: 1,
    paddingLeft: 2,
  },
  listItemMarker: {
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
});

interface MarkdownPdfProps {
  text: string;
}

const renderNode = (node: RootContent, parentType?: string): ReactNode => {
  switch (node.type) {
    case 'heading':
      const HeadingStyle = styles[`h${node.depth}` as keyof typeof styles];
      return (
        <Text style={HeadingStyle}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );

    case 'paragraph':
      return (
        <Text style={styles.paragraph}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );

    case 'list':
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

    case 'listItem':
      return (node.children as RootContent[]).map((child, i) => (
        <Fragment key={i}>{renderNode(child, 'listItem')}</Fragment>
      ));

    case 'table':
      return (
        <View style={styles.table}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </View>
      );

    case 'tableRow':
      return (
        <View style={styles.tableRow}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </View>
      );

    case 'tableCell':
      return (
        <Text style={parentType === 'tableHeader' ? styles.tableHeader : styles.tableCell}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );

    case 'text':
      return node.value;

    case 'strong':
      return (
        <Text style={styles.strong}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );

    case 'emphasis':
      return (
        <Text style={styles.emphasis}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );

    default:
      if ((node as any).children) {
        return ((node as any).children as RootContent[]).map((child, i) => (
          <Fragment key={i}>{renderNode(child)}</Fragment>
        ));
      }
      return null;
  }
};

const MarkdownPdf: FC<MarkdownPdfProps> = ({ text }) => {
  const processor = unified().use(remarkParse).use(remarkGfm);
  const ast = processor.parse(text) as Root;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {ast.children.map((node, i) => (
          <Fragment key={i}>{renderNode(node)}</Fragment>
        ))}
      </Page>
    </Document>
  );
};

export default MarkdownPdf;
