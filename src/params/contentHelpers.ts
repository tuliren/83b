import { FormDataMap } from '@/params/common';
import Handlebars from 'handlebars';

Handlebars.registerHelper('eq', function (a, b) {
  return a === b;
});

Handlebars.registerHelper('neq', function (a, b) {
  return a !== b;
});

Handlebars.registerHelper('multiply', function (a, b) {
  return parseFloat(a) * parseFloat(b);
});

Handlebars.registerHelper('subtract', function (a, b) {
  return parseFloat(a) - parseFloat(b);
});

Handlebars.registerHelper('add', function (a, b) {
  return parseFloat(a) + parseFloat(b);
});

Handlebars.registerHelper('divide', function (a, b) {
  if (parseFloat(b) === 0) return 0;
  return parseFloat(a) / parseFloat(b);
});

Handlebars.registerHelper('formatNumber', function (value) {
  if (value === undefined || value === null) return '';
  return value.toString();
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

export const replacePlaceholders = (text: string, data: FormDataMap): string => {
  return processTemplate(text, data);
};

export const processIfBlocks = (text: string, data: FormDataMap): string => {
  return processTemplate(text, data);
};

export const processMarkdown = (text: string, data: FormDataMap): string => {
  return processTemplate(text, data);
};
