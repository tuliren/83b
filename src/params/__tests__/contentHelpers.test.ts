import { FormDataMap } from '@/params/common';
import { processIfBlocks, processMarkdown, replacePlaceholders } from '@/params/contentHelpers';

describe('replacePlaceholders', () => {
  it('replaces single placeholder with corresponding data', () => {
    const template = 'Hello {{name}}!';
    const data: FormDataMap = { name: 'John' };

    const result = replacePlaceholders(template, data);

    expect(result).toBe('Hello John!');
  });

  it('replaces multiple placeholders with corresponding data', () => {
    const template = '{{greeting}} {{name}}! How is {{location}}?';
    const data: FormDataMap = {
      greeting: 'Hi',
      name: 'Alice',
      location: 'London',
    };

    const result = replacePlaceholders(template, data);

    expect(result).toBe('Hi Alice! How is London?');
  });

  it('preserves placeholder when no data is provided', () => {
    const template = 'Hello {{name}}!';
    const data: FormDataMap = {};

    const result = replacePlaceholders(template, data);

    expect(result).toBe('Hello {{name}}!');
  });

  it('preserves placeholder when data value is empty string', () => {
    const template = 'Hello {{name}}!';
    const data: FormDataMap = { name: '' };

    const result = replacePlaceholders(template, data);

    expect(result).toBe('Hello {{name}}!');
  });

  it('handles whitespace in placeholder names', () => {
    const template = 'Hello {{  name  }}!';
    const data: FormDataMap = { name: 'John' };

    const result = replacePlaceholders(template, data);

    expect(result).toBe('Hello John!');
  });

  it('trims whitespace from data values', () => {
    const template = 'Hello {{name}}!';
    const data: FormDataMap = { name: '  John  ' };

    const result = replacePlaceholders(template, data);

    expect(result).toBe('Hello John!');
  });
});

describe('processIfBlocks', () => {
  it('includes content when condition is true', () => {
    const template = 'Start {{#if name}}Hello {{name}}{{/if}} End';
    const data: FormDataMap = { name: 'John' };

    const result = processIfBlocks(template, data);

    expect(result).toBe('Start Hello John End');
  });

  it('excludes content when condition is false', () => {
    const template = 'Start {{#if name}}Hello {{name}}{{/if}} End';
    const data: FormDataMap = { name: '' };

    const result = processIfBlocks(template, data);

    expect(result).toBe('Start  End');
  });

  it('processes equality operator correctly', () => {
    const template = '{{#if status == active}}User is active{{/if}}';
    const data: FormDataMap = { status: 'active' };

    const result = processIfBlocks(template, data);

    expect(result).toBe('User is active');
  });

  it('processes inequality operator correctly', () => {
    const template = '{{#if status != inactive}}User is not inactive{{/if}}';
    const data: FormDataMap = { status: 'active' };

    const result = processIfBlocks(template, data);

    expect(result).toBe('User is not inactive');
  });

  it('handles nested placeholders inside if blocks', () => {
    const template = '{{#if user}}Welcome {{user}}, your role is {{role}}{{/if}}';
    const data: FormDataMap = { user: 'John', role: 'admin' };

    const result = processIfBlocks(template, data);

    expect(result).toBe('Welcome John, your role is admin');
  });

  it('handles multiple if blocks', () => {
    const template = `
      {{#if name}}Name: {{name}}{{/if}}
      {{#if email}}Email: {{email}}{{/if}}
    `;
    const data: FormDataMap = { name: 'John', email: 'john@example.com' };

    const result = processIfBlocks(template, data);

    expect(result.trim()).toBe('Name: John\n      Email: john@example.com');
  });

  it('handles whitespace in condition', () => {
    const template = '{{#if  status  ==  active  }}Active{{/if}}';
    const data: FormDataMap = { status: 'active' };

    const result = processIfBlocks(template, data);

    expect(result).toBe('Active');
  });
});

describe('processMarkdown', () => {
  it('processes both placeholders and if blocks', () => {
    const template = `
      {{#if user}}
        Welcome {{user}}!
        {{#if role == admin}}
          You have admin access.
        {{/if}}
      {{/if}}
    `;
    const data: FormDataMap = { user: 'John', role: 'admin' };

    const result = processMarkdown(template, data);

    expect(result.trim()).toBe('Welcome John!\n        You have admin access.');
  });

  it('handles empty data object', () => {
    const template = `
      {{#if user}}
        Welcome {{user}}!
      {{/if}}
      {{name}}
    `;
    const data: FormDataMap = {};

    const result = processMarkdown(template, data);

    expect(result.trim()).toBe('{{name}}');
  });

  it('preserves non-template text', () => {
    const template = 'Regular text here\n{{#if user}}User: {{user}}{{/if}}\nMore regular text';
    const data: FormDataMap = { user: 'John' };

    const result = processMarkdown(template, data);

    expect(result).toBe('Regular text here\nUser: John\nMore regular text');
  });
});
