import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { Select } from "../../formFields";
import { FieldType, ResultType } from "@/graphql/generated/graphql";
import { SelectOption } from "../../formFields/Select";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { PanelAccordion } from "../../../FlowConfigDiagram/PanelAccordion";
import { FormHelperText } from "@mui/material";

interface ActionFilterFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const ActionFilterForm = ({ formMethods, formIndex }: ActionFilterFormProps) => {
  const error = formMethods.formState.errors.steps?.[formIndex]?.action;

  // get field options asssociated with decisions to use as action filters
  const results = formMethods.watch(`steps.${formIndex}.result`);
  const responseFields = formMethods.watch(`steps.${formIndex}.response.fields`);
  const filterOptions: SelectOption[] = [];
  (results ?? [])
    .filter((res) => res.type === ResultType.Decision)
    .forEach((res, resIndex) => {
      const field = responseFields.find((f) => f.fieldId === res.fieldId);
      if (!field || field.type !== FieldType.Options) return;
      (field.optionsConfig.options ?? []).map((o) => {
        filterOptions.push({
          name: `Result ${resIndex}: "${o.name}"`,
          value: o.optionId,
        });
      });
    });

  return (
    (filterOptions ?? []).length > 0 && (
      <PanelAccordion title="Filter" hasError={!!error}>
        {error?.root?.message && (
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {error?.root?.message}
          </FormHelperText>
        )}
        <Select<FlowSchemaType>
          control={formMethods.control}
          label="When to run action"
          renderValue={(val) => {
            const optionName = getSelectOptionName(filterOptions, val);
            if (optionName) {
              return "Only run action on: " + optionName;
            } else return "Run action on all options";
          }}
          selectOptions={[...filterOptions]}
          displayLabel={false}
          name={`steps.${formIndex}.action.filterOptionId`}
        />
      </PanelAccordion>
    )
  );
};
