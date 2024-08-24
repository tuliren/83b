export interface FormParam {
  id: string;
  name: string;
  description?: string;
  placeholder?: string;
  type: 'string' | 'integer' | 'boolean' | 'date';
  required: boolean;
  default?: string;
}

export const ElectionParams: FormParam[] = [
  {
    id: 'person-name',
    name: 'Taxpayer name',
    type: 'string',
    required: true,
  },
  {
    id: 'person-address',
    name: 'Taxpayer address',
    type: 'string',
    required: true,
  },
  {
    id: 'person-ssn',
    name: 'Taxpayer SSN',
    description: 'Your SSN is not stored, and never leaves the browser',
    type: 'string',
    required: true,
  },
  {
    id: 'spouse-name',
    name: 'Spouse name',
    description: "Name of the taxpayer's spouse or registered domestic partner",
    type: 'string',
    required: false,
  },
  {
    id: 'spouse-address',
    name: 'Spouse address',
    type: 'string',
    required: false,
  },
  {
    id: 'spouse-ssn',
    name: 'Spouse SSN',
    description: "SSN of the taxpayer's spouse or registered domestic partner",
    type: 'string',
    required: false,
  },
  {
    id: 'share-number',
    name: 'Number of shares',
    description: 'Total number of shares applicable to the election',
    type: 'integer',
    required: true,
  },
  {
    id: 'transfer-date',
    name: 'Transfer date',
    description: 'Date of the transfer of the shares',
    type: 'date',
    required: true,
  },
  {
    id: 'tax-year',
    name: 'Tax year',
    description: 'Tax year for which the election is being made',
    type: 'integer',
    required: true,
  },
];
