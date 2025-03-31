import { FormDataMap } from '@/params/common';
import Handlebars from 'handlebars';

type HandlebarsValue = string | number | boolean | null | undefined;

Handlebars.registerHelper('eq', function (a: HandlebarsValue, b: HandlebarsValue): boolean {
  return String(a) === String(b);
});

Handlebars.registerHelper('neq', function (a: HandlebarsValue, b: HandlebarsValue): boolean {
  return a !== b;
});

Handlebars.registerHelper('multiply', function (a: HandlebarsValue, b: HandlebarsValue): number {
  return parseFloat(String(a)) * parseFloat(String(b));
});

Handlebars.registerHelper('subtract', function (a: HandlebarsValue, b: HandlebarsValue): number {
  return parseFloat(String(a)) - parseFloat(String(b));
});

Handlebars.registerHelper('add', function (a: HandlebarsValue, b: HandlebarsValue): number {
  return parseFloat(String(a)) + parseFloat(String(b));
});

Handlebars.registerHelper('divide', function (a: HandlebarsValue, b: HandlebarsValue): number {
  const divisor = parseFloat(String(b));
  if (divisor === 0) {
    return 0;
  }
  return parseFloat(String(a)) / divisor;
});

Handlebars.registerHelper('formatNumber', function (value: HandlebarsValue): string {
  if (value === undefined || value === null) {
    return '';
  }
  return String(value);
});

Handlebars.registerHelper('round', function (value: HandlebarsValue, precision?: number): string {
  if (value === undefined || value === null) {
    return '';
  }
  const p = precision == null ? 2 : precision < 0 ? 0 : precision;
  return parseFloat(String(value)).toFixed(p);
});

const templateCache = new Map<string, HandlebarsTemplateDelegate>();

/**
 * Compiles a template if not already cached and returns the compiled template
 */
const getCompiledTemplate = (template: string): HandlebarsTemplateDelegate => {
  if (!templateCache.has(template)) {
    templateCache.set(template, Handlebars.compile(template));
  }
  return templateCache.get(template)!;
};

/**
 * Processes a template with Handlebars, replacing placeholders and processing conditional blocks
 */
export const processTemplate = (template: string, data: FormDataMap): string => {
  const compiledTemplate = getCompiledTemplate(template);
  return compiledTemplate(data);
};
