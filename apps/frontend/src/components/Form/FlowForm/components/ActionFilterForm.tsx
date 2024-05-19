import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { Select, TextField } from "../../formFields";
import { ActionType, FieldType, ResultType } from "@/graphql/generated/graphql";
import { SelectOption } from "../../formFields/Select";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { FormHelperText } from "@mui/material";
import { DefaultOptionSelection } from "../formValidation/fields";
import { useEffect } from "react";

interface ActionFilterFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  actionType: ActionType;
}

export const ActionFilterForm = ({ formMethods, formIndex, actionType }: ActionFilterFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.action`, {
      filterOptionId: DefaultOptionSelection.None,
      type: ActionType.TriggerStep,
    });
  }, [actionType]);

  const error = formMethods.formState.errors.steps?.[formIndex]?.action;

  // get field options asssociated with decisions to use as action filters
  const results = formMethods.watch(`steps.${formIndex}.result`);
  const responseFields = formMethods.watch(`steps.${formIndex}.response.fields`);
  const filterOptions: SelectOption[] = [
    { name: "Action runs for every result", value: DefaultOptionSelection.None },
  ];

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
    <PanelAccordion
      title="Filter"
      hasError={!!error}
      sx={{ display: (filterOptions ?? []).length > 1 ? "block" : "none" }}
    >
      {error?.root?.message && (
        <FormHelperText
          sx={{
            color: "error.main",
          }}
        >
          {error?.root?.message}
        </FormHelperText>
      )}
      <TextField<FlowSchemaType>
        display={false}
        name={`steps.${formIndex}.action.type`}
        control={formMethods.control}
        label="fieldId"
        disabled={true}
        defaultValue=""
      />
      <Select<FlowSchemaType>
        control={formMethods.control}
        label="When to run action"
        renderValue={(val) => {
          if (val === DefaultOptionSelection.None) return "Action runs on every result";
          const optionName = getSelectOptionName(filterOptions, val);
          if (optionName) {
            return "Only run action on: " + optionName;
          } else return "Run action on all options";
        }}
        selectOptions={[...filterOptions]}
        displayLabel={false}
        defaultValue=""
        name={`steps.${formIndex}.action.filterOptionId`}
      />
    </PanelAccordion>
    // )
  );
};
