import { FormDataMap } from '@/params/common';

export const replacePlaceholders = (text: string, data: FormDataMap): string => {
  return text.replace(/{{(.*?)}}/g, (_, key) => {
    const trimmedKey = key.trim();
    return data?.[trimmedKey] != null && data[trimmedKey] !== ''
      ? String(data[trimmedKey]).trim()
      : `{{${trimmedKey}}}`;
  });
};

export const processIfBlocks = (text: string, data: FormDataMap): string => {
  let processedText = text;
  let previousText;

  do {
    previousText = processedText;
    processedText = processedText.replace(/{{#if\s+(.*?)}}([\s\S]*?){{\/if}}/g, (_, condition, content) => {
      const trimmedCondition = condition.trim();
      const [key, operator, value] = trimmedCondition.split(/\s+/);

      const dataValue = data[key];
      let conditionMet: boolean;

      switch (operator) {
        case '==': {
          conditionMet = String(dataValue) === value;
          break;
        }
        case '!=': {
          conditionMet = String(dataValue) !== value;
          break;
        }
        default: {
          conditionMet = Boolean(dataValue);
        }
      }
      return conditionMet ? replacePlaceholders(content, data).trim() : '';
    });
  } while (processedText !== previousText);

  return processedText;
};

export const processMarkdown = (text: string, data: FormDataMap): string => {
  return processIfBlocks(replacePlaceholders(text, data), data);
};
