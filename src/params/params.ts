import { Operation } from '@/params/operations';

export enum DefaultFormParamType {
  Value = 'value',
  Formula = 'formula',
  Function = 'function',
}

export interface DefaultValueFormParam {
  type: DefaultFormParamType.Value;
  value: string;
}

export interface DefaultFormulaFormParam {
  type: DefaultFormParamType.Formula;
  operation: Operation;
}

export enum FormParamFunction {
  CurrentDate = 'current-date',
}

export interface DefaultFunctionFormParam {
  type: DefaultFormParamType.Function;
  function: FormParamFunction;
}

export type DefaultFormParam = DefaultValueFormParam | DefaultFormulaFormParam | DefaultFunctionFormParam;

export interface FormParam {
  id: string;
  name: string;
  description?: string;
  placeholder?: string;
  valueType: 'string' | 'number' | 'date';
  paramType: 'required' | 'optional' | 'calculated';
  default?: DefaultFormParam;
}
