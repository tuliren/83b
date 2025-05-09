import { FormDataMap } from '@/params/common';
import { processTemplate } from '@/params/contentHelpers';
import { DefaultFormParamType, FormParam, FormParamFunction } from '@/params/params';

export const getInitialParams = (formParams: FormParam[]): FormDataMap => {
  return formParams.reduce((acc, param) => {
    switch (param.default?.type) {
      case DefaultFormParamType.Value: {
        acc[param.id] = param.default.value;
        break;
      }
      case DefaultFormParamType.HandlebarsFormula: {
        acc[param.id] = processTemplate(param.default.template, acc);
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

export const isParamConditionMet = (formData: FormDataMap, condition: Record<string, string | number>): boolean => {
  return Object.entries(condition).every(([paramId, value]) => {
    if (paramId in formData) {
      return formData[paramId] === value.toString();
    }
    return false;
  });
};

export const evaluateParams = (formData: FormDataMap, formParams: FormParam[]): FormDataMap => {
  return formParams.reduce(
    (acc, param) => {
      if (param.paramType === 'calculated') {
        if (param.default?.type === DefaultFormParamType.HandlebarsFormula) {
          acc[param.id] = processTemplate(param.default.template, acc);
        }
      }
      return acc;
    },
    { ...formData }
  );
};

export const sortFormParamsByDependencies = (formParams: FormParam[]): FormParam[] => {
  const dependencyGraph: Record<string, string[]> = {};

  formParams.forEach((param) => {
    dependencyGraph[param.id] = [];
    if (param.paramType === 'calculated') {
      if (param.default?.type === DefaultFormParamType.HandlebarsFormula) {
        dependencyGraph[param.id].push(...param.default.dependencies);
      }
    }
    if (param.condition != null) {
      dependencyGraph[param.id].push(...extractConditionDependencies(param.condition));
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

const extractConditionDependencies = (condition: Record<string, string | number>): string[] => {
  return Object.keys(condition);
};
