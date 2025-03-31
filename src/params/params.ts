export enum DefaultFormParamType {
  Value = 'value',
  Function = 'function',
  HandlebarsFormula = 'handlebars-formula',
}

export interface DefaultValueFormParam {
  type: DefaultFormParamType.Value;
  value: string | number;
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

export type DefaultFormParam = DefaultValueFormParam | DefaultFunctionFormParam | DefaultHandlebarsFormulaFormParam;

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
