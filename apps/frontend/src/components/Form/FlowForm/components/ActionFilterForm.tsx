import { FormHelperText } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Select } from "../../formFields";
import { SelectOption } from "../../formFields/Select";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { FlowSchemaType } from "../formValidation/flow";
import { getActionFilterOptions } from "../helpers/getActionFilterOptions";

interface ActionFilterFormProps {
  stepIndex: number; // react-hook-form name
  show: boolean;
}

export const ActionFilterForm = ({ stepIndex, show }: ActionFilterFormProps) => {
  const { formState, getValues, setValue } = useFormContext<FlowSchemaType>();

  const error = formState.errors.steps?.[stepIndex]?.action;

  // get field options asssociated with decisions to use as action filters
  const step = getValues(`steps.${stepIndex}`);
  const actionFilterId = step?.action?.filterOptionId;

  // if no action, don't render so that this action form stays null
  if (!actionFilterId) return null;

  const filterOptions: SelectOption[] = getActionFilterOptions({
    results: step?.result,
    responseFields: step?.fieldSet.fields,
  });

  // remove linked option if that result is removed
  useEffect(() => {
    if (!filterOptions.find((option) => option.value === actionFilterId)) {
      setValue(`steps.${stepIndex}.action.filterOptionId`, null);
    }
  }, [filterOptions, actionFilterId]);

  return (
    <PanelAccordion title="Filter" hasError={!!error} sx={{ display: show ? "block" : "none" }}>
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
        label="When to run action"
        renderValue={(val) => {
          const optionName = getSelectOptionName(filterOptions, val as string) ?? "";
          return "Only run action on: " + optionName;
        }}
        selectOptions={[...filterOptions]}
        // defaultValue=""
        name={`steps.${stepIndex}.action.filterOptionId`}
      />
    </PanelAccordion>
    // )
  );
};
