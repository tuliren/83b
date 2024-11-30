import { FC, Fragment } from 'react';
import { Document, Font, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import type { RootContent, Root } from 'mdast';

Font.register({
  family: 'Inter',
  src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 12,
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    marginVertical: 16,
  },
  h2: {
    fontSize: 24,
    fontWeight: 'semibold',
    marginVertical: 12,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  h3: {
    fontSize: 20,
    fontWeight: 'semibold',
    marginVertical: 10,
  },
  paragraph: {
    marginVertical: 8,
    lineHeight: 1.6,
  },
  list: {
    marginLeft: 16,
    marginVertical: 8,
  },
  listItem: {
    marginVertical: 4,
    flexDirection: 'row',
  },
  listItemBullet: {
    width: 10,
    marginRight: 6,
  },
  table: {
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  tableHeader: {
    backgroundColor: '#f9fafb',
    padding: 8,
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 8,
    flex: 1,
  },
});

interface MarkdownPdfProps {
  text: string;
}

const renderNode = (node: RootContent): React.ReactNode => {
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
            <View key={i} style={styles.listItem}>
              <Text style={styles.listItemBullet}>{node.ordered ? `${i + 1}.` : '•'}</Text>
              {renderNode(child)}
            </View>
          ))}
        </View>
      );

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
        <Text style={styles.tableCell}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );

    case 'text':
      return node.value;

    case 'strong':
      return (
        <Text style={{ fontWeight: 'bold' }}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );

    case 'emphasis':
      return (
        <Text style={{ fontStyle: 'italic' }}>
          {(node.children as RootContent[]).map((child, i) => (
            <Fragment key={i}>{renderNode(child)}</Fragment>
          ))}
        </Text>
      );

    case 'listItem':
      return (node.children as RootContent[]).map((child, i) => <Fragment key={i}>{renderNode(child)}</Fragment>);

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
