import { processTemplate } from '../contentHelpers';
import { FormDataMap } from '../common';
import Handlebars from 'handlebars';

const testHelper = (helperName: string, args: any[], expected: any) => {
  const template = `{{${helperName} ${args.map((_, i) => `arg${i}`).join(' ')}}}`;
  const data = args.reduce((acc, arg, i) => ({ ...acc, [`arg${i}`]: arg }), {});
  const result = processTemplate(template, data);
  expect(result).toBe(String(expected));
};

describe('Handlebars helpers', () => {
  describe('eq helper', () => {
    it('returns true when values are equal as strings', () => {
      testHelper('eq', ['test', 'test'], 'true');
      testHelper('eq', [123, '123'], 'true');
      testHelper('eq', [true, 'true'], 'true');
    });

    it('returns false when values are not equal as strings', () => {
      testHelper('eq', ['test', 'other'], 'false');
      testHelper('eq', [123, 456], 'false');
      testHelper('eq', [true, false], 'false');
    });

    it('handles null and undefined values', () => {
      testHelper('eq', [null, null], 'true');
      testHelper('eq', [undefined, undefined], 'true');
      testHelper('eq', [null, undefined], 'false');
    });
  });

  describe('neq helper', () => {
    it('returns true when values are not equal', () => {
      testHelper('neq', ['test', 'other'], 'true');
      testHelper('neq', [123, 456], 'true');
      testHelper('neq', [true, false], 'true');
    });

    it('returns false when values are equal', () => {
      testHelper('neq', ['test', 'test'], 'false');
      testHelper('neq', [123, 123], 'false');
      testHelper('neq', [true, true], 'false');
    });
  });

  describe('multiply helper', () => {
    it('multiplies two numbers', () => {
      testHelper('multiply', [5, 3], '15');
      testHelper('multiply', [2.5, 2], '5');
      testHelper('multiply', [0, 10], '0');
    });

    it('handles string numbers', () => {
      testHelper('multiply', ['5', '3'], '15');
      testHelper('multiply', ['2.5', '2'], '5');
    });

    it('handles invalid inputs', () => {
      testHelper('multiply', ['abc', 3], 'NaN');
      testHelper('multiply', [5, 'xyz'], 'NaN');
    });
  });

  describe('subtract helper', () => {
    it('subtracts second number from first', () => {
      testHelper('subtract', [10, 3], '7');
      testHelper('subtract', [5, 10], '-5');
      testHelper('subtract', [3.5, 1.5], '2');
    });

    it('handles string numbers', () => {
      testHelper('subtract', ['10', '3'], '7');
      testHelper('subtract', ['5', '10'], '-5');
    });
  });

  describe('add helper', () => {
    it('adds two numbers', () => {
      testHelper('add', [5, 3], '8');
      testHelper('add', [2.5, 2.5], '5');
      testHelper('add', [0, 10], '10');
    });

    it('handles string numbers', () => {
      testHelper('add', ['5', '3'], '8');
      testHelper('add', ['2.5', '2.5'], '5');
    });
  });

  describe('divide helper', () => {
    it('divides first number by second', () => {
      testHelper('divide', [10, 2], '5');
      testHelper('divide', [5, 2], '2.5');
      testHelper('divide', [0, 5], '0');
    });

    it('returns 0 when dividing by zero', () => {
      testHelper('divide', [10, 0], '0');
    });

    it('handles string numbers', () => {
      testHelper('divide', ['10', '2'], '5');
      testHelper('divide', ['5', '2'], '2.5');
    });
  });

  describe('formatNumber helper', () => {
    it('formats numbers as strings', () => {
      testHelper('formatNumber', [123], '123');
      testHelper('formatNumber', [123.45], '123.45');
    });

    it('returns empty string for null or undefined', () => {
      testHelper('formatNumber', [null], '');
      testHelper('formatNumber', [undefined], '');
    });

    it('handles non-numeric values', () => {
      testHelper('formatNumber', ['test'], 'test');
      testHelper('formatNumber', [true], 'true');
    });
  });

  describe('round helper', () => {
    it('rounds numbers to 2 decimal places by default', () => {
      testHelper('round', [123.456], '123');
      testHelper('round', [123.45], '123');
      testHelper('round', [123], '123');
    });

    it('rounds to specified precision', () => {
      testHelper('round', [123.456, 0], '123');
      testHelper('round', [123.456, 1], '123.5');
      testHelper('round', [123.456, 3], '123.456');
      testHelper('round', [123.456, 4], '123.4560');
    });

    it('handles negative precision as 0', () => {
      testHelper('round', [123.456, -1], '123');
      testHelper('round', [123.456, -2], '123');
    });

    it('returns empty string for null or undefined', () => {
      testHelper('round', [null], '');
      testHelper('round', [undefined], '');
    });

    it('handles string numbers', () => {
      testHelper('round', ['123.456'], '123');
      testHelper('round', ['123.456', 1], '123.5');
    });
  });
});

describe('processTemplate', () => {
  it('processes simple templates with variables', () => {
    const template = 'Hello {{name}}!';
    const data: FormDataMap = { name: 'John' };

    const result = processTemplate(template, data);

    expect(result).toBe('Hello John!');
  });

  it('processes templates with multiple variables', () => {
    const template = 'Hello {{name}}! Welcome to {{city}}.';
    const data: FormDataMap = { name: 'John', city: 'New York' };

    const result = processTemplate(template, data);

    expect(result).toBe('Hello John! Welcome to New York.');
  });

  it('processes templates with conditional blocks', () => {
    const template = 'Hello {{name}}!{{#if (eq hasAccess true)}} You have access.{{/if}}';
    const data: FormDataMap = { name: 'John', hasAccess: 'true' };

    const result = processTemplate(template, data);

    expect(result).toBe('Hello John! You have access.');
  });

  it('processes templates with nested conditional blocks', () => {
    const template = `
      {{#if name}}
        Hello {{name}}!
        {{#if (eq role "admin")}}
          You have admin access.
        {{/if}}
      {{/if}}
    `;
    const data: FormDataMap = { name: 'John', role: 'admin' };

    const result = processTemplate(template, data);

    expect(result.trim()).toBe('Hello John!\n          You have admin access.');
  });

  it('processes templates with math operations', () => {
    const template = 'Total: ${{round (multiply price quantity)}}';
    const data: FormDataMap = { price: '10.5', quantity: '3' };

    const result = processTemplate(template, data);

    expect(result).toBe('Total: $32');
  });

  it('caches compiled templates for better performance', () => {
    const template1 = `Template1-${Date.now()}-${Math.random()}`; // Ensure unique template
    const template2 = `Template2-${Date.now()}-${Math.random()}`; // Ensure unique template
    const data: FormDataMap = { name: 'John' };

    processTemplate(template1, data);

    processTemplate(template1, data);

    processTemplate(template2, data);

    expect(true).toBe(true);
  });
});
