import { getInitialParams, isParamConditionMet, evaluateParams, sortFormParamsByDependencies } from '../paramHelpers';
import { FormDataMap } from '../common';
import { DefaultFormParamType, FormParam, FormParamFunction } from '../params';

jest.mock('../contentHelpers', () => ({
  processTemplate: (template: string, data: FormDataMap): string => {
    if (template === '{{multiply base 2}}') {
      return '20';
    }

    if (template.includes('multiply')) {
      const match = template.match(/{{multiply\s+(\w+)\s+(\w+)}}/);
      if (match) {
        const [_, a, b] = match;
        return String(Number(data[a]) * Number(data[b]));
      }
    }
    if (template.includes('add')) {
      const match = template.match(/{{add\s+(\w+)\s+(\w+)}}/);
      if (match) {
        const [_, a, b] = match;
        return String(Number(data[a]) + Number(data[b]));
      }
    }
    return template;
  },
}));

describe('paramHelpers', () => {
  describe('getInitialParams', () => {
    it('initializes parameters with value defaults', () => {
      const formParams: FormParam[] = [
        {
          id: 'param1',
          name: 'Parameter 1',
          valueType: 'string',
          paramType: 'required',
          default: {
            type: DefaultFormParamType.Value,
            value: 'default value',
          },
        },
        {
          id: 'param2',
          name: 'Parameter 2',
          valueType: 'number',
          paramType: 'required',
          default: {
            type: DefaultFormParamType.Value,
            value: '42',
          },
        },
      ];

      const result = getInitialParams(formParams);

      expect(result).toEqual({
        param1: 'default value',
        param2: '42',
      });
    });

    it('initializes parameters with Handlebars formula defaults', () => {
      const formParams: FormParam[] = [
        {
          id: 'base',
          name: 'Base Value',
          valueType: 'number',
          paramType: 'required',
          default: {
            type: DefaultFormParamType.Value,
            value: '10',
          },
        },
        {
          id: 'calculated',
          name: 'Calculated Value',
          valueType: 'number',
          paramType: 'calculated',
          default: {
            type: DefaultFormParamType.HandlebarsFormula,
            template: '{{multiply base 2}}',
            dependencies: ['base'],
          },
        },
      ];

      const result = getInitialParams(formParams);

      expect(result).toEqual({
        base: '10',
        calculated: '20',
      });
    });

    it('initializes parameters with function defaults', () => {
      const mockDate = new Date('2025-01-01');
      jest.spyOn(global, 'Date').mockImplementation(() => mockDate);

      const formParams: FormParam[] = [
        {
          id: 'today',
          name: 'Current Date',
          valueType: 'date',
          paramType: 'required',
          default: {
            type: DefaultFormParamType.Function,
            function: FormParamFunction.CurrentDate,
          },
        },
      ];

      const result = getInitialParams(formParams);

      expect(result).toEqual({
        today: '2025-01-01',
      });

      jest.restoreAllMocks();
    });

    it('initializes parameters with empty string for unknown default types', () => {
      const formParams: FormParam[] = [
        {
          id: 'param',
          name: 'Parameter',
          valueType: 'string',
          paramType: 'required',
          default: {
            type: DefaultFormParamType.Value,
            value: '',
          },
        },
      ];

      const result = getInitialParams(formParams);

      expect(result).toEqual({
        param: '',
      });
    });
  });

  describe('isParamConditionMet', () => {
    it('returns true when all conditions are met', () => {
      const formData: FormDataMap = {
        param1: 'value1',
        param2: '42',
        param3: 'true',
      };

      const condition = {
        param1: 'value1',
        param2: 42,
      };

      const result = isParamConditionMet(formData, condition);

      expect(result).toBe(true);
    });

    it('returns false when any condition is not met', () => {
      const formData: FormDataMap = {
        param1: 'value1',
        param2: '42',
        param3: 'true',
      };

      const condition = {
        param1: 'value1',
        param2: 43,
      };

      const result = isParamConditionMet(formData, condition);

      expect(result).toBe(false);
    });

    it('returns false when a condition parameter is missing from form data', () => {
      const formData: FormDataMap = {
        param1: 'value1',
        param3: 'true',
      };

      const condition = {
        param1: 'value1',
        param2: 42,
      };

      const result = isParamConditionMet(formData, condition);

      expect(result).toBe(false);
    });
  });

  describe('evaluateParams', () => {
    it('evaluates calculated parameters with Handlebars formulas', () => {
      const formData: FormDataMap = {
        base: '10',
        multiplier: '3',
        calculated: '',
      };

      const formParams: FormParam[] = [
        {
          id: 'base',
          name: 'Base Value',
          valueType: 'number',
          paramType: 'required',
        },
        {
          id: 'multiplier',
          name: 'Multiplier',
          valueType: 'number',
          paramType: 'required',
        },
        {
          id: 'calculated',
          name: 'Calculated Value',
          valueType: 'number',
          paramType: 'calculated',
          default: {
            type: DefaultFormParamType.HandlebarsFormula,
            template: '{{multiply base multiplier}}',
            dependencies: ['base', 'multiplier'],
          },
        },
      ];

      const result = evaluateParams(formData, formParams);

      expect(result).toEqual({
        base: '10',
        multiplier: '3',
        calculated: '30',
      });
    });

    it('preserves non-calculated parameters', () => {
      const formData: FormDataMap = {
        param1: 'value1',
        param2: '42',
      };

      const formParams: FormParam[] = [
        {
          id: 'param1',
          name: 'Parameter 1',
          valueType: 'string',
          paramType: 'required',
        },
        {
          id: 'param2',
          name: 'Parameter 2',
          valueType: 'number',
          paramType: 'required',
        },
      ];

      const result = evaluateParams(formData, formParams);

      expect(result).toEqual({
        param1: 'value1',
        param2: '42',
      });
    });
  });

  describe('sortFormParamsByDependencies', () => {
    it('sorts parameters based on their dependencies', () => {
      const formParams: FormParam[] = [
        {
          id: 'total',
          name: 'Total',
          valueType: 'number',
          paramType: 'calculated',
          default: {
            type: DefaultFormParamType.HandlebarsFormula,
            template: '{{add subtotal tax}}',
            dependencies: ['subtotal', 'tax'],
          },
        },
        {
          id: 'price',
          name: 'Price',
          valueType: 'number',
          paramType: 'required',
        },
        {
          id: 'quantity',
          name: 'Quantity',
          valueType: 'number',
          paramType: 'required',
        },
        {
          id: 'subtotal',
          name: 'Subtotal',
          valueType: 'number',
          paramType: 'calculated',
          default: {
            type: DefaultFormParamType.HandlebarsFormula,
            template: '{{multiply price quantity}}',
            dependencies: ['price', 'quantity'],
          },
        },
        {
          id: 'tax',
          name: 'Tax',
          valueType: 'number',
          paramType: 'calculated',
          default: {
            type: DefaultFormParamType.HandlebarsFormula,
            template: '{{multiply subtotal 0.1}}',
            dependencies: ['subtotal'],
          },
        },
      ];

      const result = sortFormParamsByDependencies(formParams);

      const priceIndex = result.findIndex((p) => p.id === 'price');
      const quantityIndex = result.findIndex((p) => p.id === 'quantity');
      const subtotalIndex = result.findIndex((p) => p.id === 'subtotal');
      const taxIndex = result.findIndex((p) => p.id === 'tax');
      const totalIndex = result.findIndex((p) => p.id === 'total');

      expect(priceIndex).toBeLessThan(subtotalIndex);
      expect(quantityIndex).toBeLessThan(subtotalIndex);
      expect(subtotalIndex).toBeLessThan(taxIndex);
      expect(subtotalIndex).toBeLessThan(totalIndex);
      expect(taxIndex).toBeLessThan(totalIndex);
    });

    it('handles parameters with conditions', () => {
      const formParams: FormParam[] = [
        {
          id: 'hasSpouse',
          name: 'Has Spouse',
          valueType: 'boolean',
          paramType: 'required',
        },
        {
          id: 'spouseName',
          name: 'Spouse Name',
          valueType: 'string',
          paramType: 'required',
          condition: {
            hasSpouse: 'true',
          },
        },
      ];

      const result = sortFormParamsByDependencies(formParams);

      const hasSpouseIndex = result.findIndex((p) => p.id === 'hasSpouse');
      const spouseNameIndex = result.findIndex((p) => p.id === 'spouseName');

      expect(hasSpouseIndex).toBeLessThan(spouseNameIndex);
    });

    it('handles circular dependencies gracefully', () => {
      const formParams: FormParam[] = [
        {
          id: 'param1',
          name: 'Parameter 1',
          valueType: 'number',
          paramType: 'calculated',
          default: {
            type: DefaultFormParamType.HandlebarsFormula,
            template: '{{add param2 1}}',
            dependencies: ['param2'],
          },
        },
        {
          id: 'param2',
          name: 'Parameter 2',
          valueType: 'number',
          paramType: 'calculated',
          default: {
            type: DefaultFormParamType.HandlebarsFormula,
            template: '{{add param1 1}}',
            dependencies: ['param1'],
          },
        },
      ];

      const result = sortFormParamsByDependencies(formParams);

      expect(result.length).toBe(2);
      expect(result.some((p) => p.id === 'param1')).toBe(true);
      expect(result.some((p) => p.id === 'param2')).toBe(true);
    });
  });
});
