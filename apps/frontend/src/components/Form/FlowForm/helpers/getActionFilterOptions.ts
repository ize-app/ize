import { FieldType, ResultType } from "@/graphql/generated/graphql";

import { getResultFormLabel } from "./getResultFormLabel";
import { SelectOption } from "../../formFields/Select";
import { FieldsSchemaType } from "../formValidation/fields";
import { ResultsSchemaType } from "../formValidation/result";

export const getActionFilterOptions = ({
  results,
  responseFields,
  optionNameOnly = false,
}: {
  results: ResultsSchemaType;
  responseFields: FieldsSchemaType;
  optionNameOnly?: boolean;
}): SelectOption[] => {
  const filterOptions: SelectOption[] = [];
  (results ?? [])
    .filter((res) => res.type === ResultType.Decision)
    .forEach((res) => {
      if (!responseFields) return;
      const field = responseFields.find((f) => f.fieldId === res.fieldId);
      if (field && field.type === FieldType.Options) {
        (field.optionsConfig.options ?? []).map((o) => {
          filterOptions.push({
            name: optionNameOnly
              ? (o.name as string)
              : `${getResultFormLabel({ result: res })}: "${o.name}"`,
            value: o.optionId,
          });
        });
      }
    });

  return filterOptions;
};
