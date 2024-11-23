import { useFormContext } from "react-hook-form";

import { FieldType, ResultType } from "@/graphql/generated/graphql";

import { getResultFormLabel } from "./getResultFormLabel";
import { SelectOption } from "../../formFields/Select";
import { FieldsSchemaType } from "../formValidation/fields";
import { FlowSchemaType } from "../formValidation/flow";
import { ResultsSchemaType } from "../formValidation/result";

const getActionFilterResultOptions = ({
  results,
  responseFields,
}: {
  results: ResultsSchemaType;
  responseFields: FieldsSchemaType;
}): SelectOption[] => {
  return (results ?? [])
    .filter((res) => res.type === ResultType.Decision)
    .map((res) => {
      const field = responseFields.find((f) => f.fieldId === res.fieldId);
      return {
        value: res.resultConfigId,
        name: `${getResultFormLabel({ result: res })}: "${field?.name}"`,
      };
    });
};

export const getActionFilterOptionOptions = ({
  results,
  resultConfigId,
  responseFields,
}: {
  results: ResultsSchemaType;
  resultConfigId: string;
  responseFields: FieldsSchemaType;
}): SelectOption[] => {
  const result = results.find((res) => res.resultConfigId === resultConfigId);
  if (!result) return [];

  const field = responseFields.find((f) => f.fieldId === result.fieldId);
  if (!field || field.type !== FieldType.Options) return [];
  return field.optionsConfig.options.map((option) => ({
    value: option.optionId,
    name: (option.name as string) ?? "",
  }));
};

export const useActionFilterOptions = ({
  stepIndex,
}: {
  stepIndex: number;
}): { results: SelectOption[]; options: SelectOption[] } => {
  const { getValues, watch } = useFormContext<FlowSchemaType>();

  const responseFields = getValues(`steps.${stepIndex}.fieldSet.fields`);
  const resultConfigs = getValues(`steps.${stepIndex}.result`);
  const actionFilter = watch(`steps.${stepIndex}.action.filter`);

  if (!actionFilter) return { results: [], options: [] };

  const results = getActionFilterResultOptions({ results: resultConfigs, responseFields });
  const options = getActionFilterOptionOptions({
    results: resultConfigs,
    resultConfigId: actionFilter.resultConfigId,
    responseFields,
  });

  return { results, options };
};
