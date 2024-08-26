import { FormDataMap } from '@/params/common';

export enum Operator {
  Plus = '+',
  Minus = '-',
  Multiply = '*',
  Divide = '/',
}

export enum OperationType {
  BiOperation = 'bi-operation',
}

export interface IOperation {
  type: OperationType;
}

export interface BiOperation extends IOperation {
  type: OperationType.BiOperation;
  operator: Operator;
  left: Operation | number | string;
  right: Operation | number | string;
}

export type Operation = BiOperation;

const evaluateOperand = (operand: Operation | number | string, valueMap: FormDataMap): number | undefined => {
  if (typeof operand === 'number') {
    return operand;
  } else if (typeof operand === 'string') {
    if (operand in valueMap) {
      const value = valueMap[operand];
      if (typeof value === 'string') {
        return parseFloat(value);
      } else {
        return value;
      }
    }
    return undefined;
  } else {
    return evaluate(operand, valueMap);
  }
};

export const evaluate = (operation: Operation, valueMap: FormDataMap): number | undefined => {
  switch (operation.type) {
    case OperationType.BiOperation: {
      const leftValue = evaluateOperand(operation.left, valueMap);
      const rightValue = evaluateOperand(operation.right, valueMap);
      if (leftValue === undefined || rightValue === undefined) {
        return undefined;
      }
      switch (operation.operator) {
        case Operator.Plus:
          return leftValue + rightValue;
        case Operator.Minus:
          return leftValue - rightValue;
        case Operator.Multiply:
          return leftValue * rightValue;
        case Operator.Divide:
          if (rightValue === 0) {
            return undefined;
          } else {
            return leftValue / rightValue;
          }
      }
    }
  }
};
