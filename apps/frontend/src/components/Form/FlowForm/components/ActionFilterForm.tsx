import { FormHelperText } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Select } from "../../formFields";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { FlowSchemaType } from "../formValidation/flow";
import { useActionFilterOptions } from "../helpers/useActionFilterOptions";

interface ActionFilterFormProps {
  stepIndex: number; // react-hook-form name
  show: boolean;
}

export const ActionFilterForm = ({ stepIndex, show }: ActionFilterFormProps) => {
  const { formState, setValue, watch } = useFormContext<FlowSchemaType>();

  const error = formState.errors.steps?.[stepIndex]?.action?.filter;

  // get field options asssociated with decisions to use as action filters
  const { results, options } = useActionFilterOptions({ stepIndex });
  const actionFilter = watch(`steps.${stepIndex}.action.filter`);

  // if no action, don't render so that this action form stays null
  if (!actionFilter) return null;

  // remove linked option if that result is removed
  useEffect(() => {
    if (
      !!actionFilter.resultConfigId &&
      !results.find((resultOption) => resultOption.value === actionFilter.resultConfigId)
    ) {
      // TODO check if this actually works
      setValue(`steps.${stepIndex}.action.filter`, { resultConfigId: "", optionId: "" });
    }
  }, [results, actionFilter]);

  useEffect(() => {
    if (
      !!actionFilter.optionId &&
      !options.find((option) => option.value === actionFilter.optionId)
    ) {
      // TODO check if this actually works
      setValue(`steps.${stepIndex}.action.filter`, { resultConfigId: "", optionId: "" });
    }
  }, [options, actionFilter]);

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
        label="Result filter"
        renderValue={(val) => {
          const optionName = getSelectOptionName(results, val as string) ?? "";
          return optionName;
        }}
        selectOptions={[...results]}
        // defaultValue=""
        name={`steps.${stepIndex}.action.filter.resultConfigId`}
      />
      <Select<FlowSchemaType>
        label="Option filter"
        display={!!actionFilter.resultConfigId}
        renderValue={(val) => {
          const optionName = getSelectOptionName(options, val as string) ?? "";
          return optionName;
        }}
        selectOptions={[...options]}
        name={`steps.${stepIndex}.action.filter.optionId`}
      />
    </PanelAccordion>
  );
};
