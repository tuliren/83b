export enum DefaultFormParamType {
  Value = 'value',
  Formula = 'formula',
  Function = 'function',
  HandlebarsFormula = 'handlebars-formula',
}

export interface DefaultValueFormParam {
  type: DefaultFormParamType.Value;
  value: string | number;
}

export interface DefaultFormulaFormParam {
  type: DefaultFormParamType.Formula;
  operation: any; // Kept for backward compatibility
}

export interface DefaultHandlebarsFormulaFormParam {
  type: DefaultFormParamType.HandlebarsFormula;
  template: string;
  dependencies: string[];
}

export enum FormParamFunction {
  CurrentDate = 'current-date',
}

export interface DefaultFunctionFormParam {
  type: DefaultFormParamType.Function;
  function: FormParamFunction;
}

export type DefaultFormParam = DefaultValueFormParam | DefaultFormulaFormParam | DefaultFunctionFormParam | DefaultHandlebarsFormulaFormParam;

export interface FormParam {
  id: string;
  name: string;
  description?: string;
  placeholder?: string;
  valueType: 'string' | 'number' | 'boolean' | 'date';
  paramType: 'required' | 'optional' | 'calculated';
  default?: DefaultFormParam;
  condition?: {
    [paramId: string]: string | number;
  };
}
