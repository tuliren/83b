import { OperationType, Operator } from '@/params/operations';
import { sortFormParamsByDependencies } from '@/params/paramHelpers';
import { DefaultFormParamType, FormParam, FormParamFunction } from '@/params/params';

export const ELECTION_PARAMS: FormParam[] = sortFormParamsByDependencies([
  {
    id: 'company-name',
    name: 'Company name',
    valueType: 'string',
    paramType: 'required',
  },
  {
    id: 'person-name',
    name: 'Taxpayer name',
    valueType: 'string',
    paramType: 'required',
  },
  {
    id: 'person-address',
    name: 'Taxpayer address',
    valueType: 'string',
    paramType: 'required',
  },
  {
    id: 'person-ssn',
    name: 'Taxpayer SSN',
    description: 'Your SSN is not stored, and never leaves the browser',
    valueType: 'string',
    paramType: 'required',
  },
  {
    id: 'spouse-name',
    name: 'Spouse name',
    description: "Name of the taxpayer's spouse or registered domestic partner",
    valueType: 'string',
    paramType: 'optional',
    default: {
      type: DefaultFormParamType.Value,
      value: 'N/A',
    },
  },
  {
    id: 'spouse-address',
    name: 'Spouse address',
    valueType: 'string',
    paramType: 'optional',
    default: {
      type: DefaultFormParamType.Value,
      value: 'N/A',
    },
  },
  {
    id: 'spouse-ssn',
    name: 'Spouse SSN',
    description: "SSN of the taxpayer's spouse or registered domestic partner",
    valueType: 'string',
    paramType: 'optional',
    default: {
      type: DefaultFormParamType.Value,
      value: 'N/A',
    },
  },
  {
    id: 'transfer-date',
    name: 'Transfer date',
    description: 'Date of the transfer of the shares',
    valueType: 'date',
    paramType: 'required',
  },
  {
    id: 'tax-year',
    name: 'Tax year',
    description: 'Tax year for which the election is being made',
    valueType: 'number',
    paramType: 'required',
  },
  {
    id: 'share-number',
    name: 'Number of shares',
    description: 'Total number of shares applicable to the election',
    valueType: 'number',
    paramType: 'required',
  },
  {
    id: 'fmv-per-share-price',
    name: 'FMV per share price',
    valueType: 'number',
    paramType: 'required',
  },
  {
    id: 'fmv-total-share-price',
    name: 'Total FMV of shares',
    valueType: 'number',
    paramType: 'calculated',
    default: {
      type: DefaultFormParamType.Formula,
      operation: {
        type: OperationType.BiOperation,
        operator: Operator.Multiply,
        left: 'fmv-per-share-price',
        right: 'share-number',
      },
    },
  },
  {
    id: 'paid-per-share-price',
    name: 'Paid per share price',
    valueType: 'number',
    paramType: 'required',
  },
  {
    id: 'paid-total-share-price',
    name: 'Total paid for shares',
    valueType: 'number',
    paramType: 'calculated',
    default: {
      type: DefaultFormParamType.Formula,
      operation: {
        type: OperationType.BiOperation,
        operator: Operator.Multiply,
        left: 'paid-per-share-price',
        right: 'share-number',
      },
    },
  },
  {
    id: 'gross-income-amount',
    name: 'Gross income amount',
    valueType: 'number',
    paramType: 'calculated',
    default: {
      type: DefaultFormParamType.Formula,
      operation: {
        type: OperationType.BiOperation,
        operator: Operator.Minus,
        left: 'fmv-total-share-price',
        right: 'paid-total-share-price',
      },
    },
  },
  {
    id: 'person-sign-date',
    name: 'Taxpayer signature date',
    valueType: 'date',
    paramType: 'optional',
    default: {
      type: DefaultFormParamType.Function,
      function: FormParamFunction.CurrentDate,
    },
  },
  {
    id: 'spouse-sign-date',
    name: 'Spouse signature date',
    valueType: 'date',
    paramType: 'optional',
    default: {
      type: DefaultFormParamType.Function,
      function: FormParamFunction.CurrentDate,
    },
  },
  {
    id: 'letter-date',
    name: 'Letter date',
    valueType: 'date',
    paramType: 'optional',
    default: {
      type: DefaultFormParamType.Function,
      function: FormParamFunction.CurrentDate,
    },
  },
]);
