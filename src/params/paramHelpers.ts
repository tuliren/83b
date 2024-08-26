import { FormDataMap } from '@/params/common';
import { Operation, OperationType, evaluate } from '@/params/operations';
import { DefaultFormParamType, FormParam, FormParamFunction } from '@/params/params';

export const getInitialParams = (formParams: FormParam[]): FormDataMap => {
  return formParams.reduce((acc, param) => {
    switch (param.default?.type) {
      case DefaultFormParamType.Value: {
        acc[param.id] = param.default.value;
        break;
      }
      case DefaultFormParamType.Formula: {
        acc[param.id] = evaluate(param.default.operation, acc) ?? '';
        break;
      }
      case DefaultFormParamType.Function: {
        switch (param.default.function) {
          case FormParamFunction.CurrentDate:
            acc[param.id] = new Date().toISOString().split('T')[0];
            break;
        }
        break;
      }
      default: {
        acc[param.id] = '';
      }
    }

    return acc;
  }, {} as FormDataMap);
};

export const evaluateParams = (formData: FormDataMap, formParams: FormParam[]): FormDataMap => {
  return formParams.reduce(
    (acc, param) => {
      if (param.paramType === 'calculated' && param.default?.type === DefaultFormParamType.Formula) {
        const value = evaluate(param.default.operation, acc);
        acc[param.id] = value !== undefined ? value.toString() : '';
      }
      return acc;
    },
    { ...formData }
  );
};

export const sortFormParamsByDependencies = (formParams: FormParam[]): FormParam[] => {
  const dependencyGraph: Record<string, string[]> = {};

  formParams.forEach((param) => {
    if (param.paramType === 'calculated' && param.default?.type === DefaultFormParamType.Formula) {
      dependencyGraph[param.id] = extractDependencies(param.default.operation);
    } else {
      dependencyGraph[param.id] = [];
    }
  });

  const sortedParams: FormParam[] = [];
  const visited: Record<string, boolean> = {};

  const visit = (paramId: string) => {
    if (visited[paramId]) {
      return;
    }
    visited[paramId] = true;

    const dependencies = dependencyGraph[paramId];
    dependencies.forEach(visit);

    const param = formParams.find((p) => p.id === paramId);
    if (param) {
      sortedParams.push(param);
    }
  };

  formParams.forEach((param) => visit(param.id));

  return sortedParams;
};

const extractDependencies = (operation: Operation): string[] => {
  const dependencies: string[] = [];

  const visitOperand = (operand: Operation | number | string) => {
    if (typeof operand === 'string') {
      dependencies.push(operand);
    } else if (typeof operand !== 'number') {
      dependencies.push(...extractDependencies(operand));
    }
  };

  if (operation.type === OperationType.BiOperation) {
    visitOperand(operation.left);
    visitOperand(operation.right);
  }

  return dependencies;
};
