import { UseFormReturn } from "react-hook-form";

import { FlowSchemaType } from "../formValidation/flow";
import { Select, TextField } from "../../formFields";
import { ActionType, FieldType, ResultType } from "@/graphql/generated/graphql";
import { SelectOption } from "../../formFields/Select";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Box, FormHelperText } from "@mui/material";
import { useEffect } from "react";
import { DefaultOptionSelection } from "../formValidation/fields";

interface ActionFilterFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const ActionFilterForm = ({ formMethods, formIndex }: ActionFilterFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.action`, {
      filterOptionId: DefaultOptionSelection.None,
      type: ActionType.TriggerStep,
    });
  }, []);

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
      <Box sx={{ display: "none" }}>
        <TextField<FlowSchemaType>
          name={`steps.${formIndex}.action.type`}
          control={formMethods.control}
          label="fieldId"
          disabled={true}
          defaultValue=""
        />
      </Box>
      <Select<FlowSchemaType>
        control={formMethods.control}
        label="When to run action"
        renderValue={(val) => {
          if (val === DefaultOptionSelection.None) return "NONNNNEEEEE!!!";
          const optionName = getSelectOptionName(filterOptions, val);
          console.log("optionName", optionName);
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
