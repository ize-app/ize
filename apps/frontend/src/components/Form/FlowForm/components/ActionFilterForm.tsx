import { FormHelperText } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { ActionType, FieldType, ResultType } from "@/graphql/generated/graphql";

import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Select, TextField } from "../../formFields";
import { SelectOption } from "../../formFields/Select";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { ActionSchemaType } from "../formValidation/action";
import { DefaultOptionSelection } from "../formValidation/fields";
import { FlowSchemaType } from "../formValidation/flow";

interface ActionFilterFormProps {
  stepIndex: number; // react-hook-form name
  action: ActionSchemaType | undefined;
  isTriggerAction?: boolean;
}

export const ActionFilterForm = ({
  stepIndex,
  action,
  isTriggerAction = false,
}: ActionFilterFormProps) => {
  const { formState, getValues, setValue } = useFormContext<FlowSchemaType>();
  useEffect(() => {
    // formMethods.setValue(`steps.${formIndex}.action`, {
    //   filterOptionId: DefaultOptionSelection.None,
    //   // type: actionType,
    // });

    // figure out way to remove this. should be handled in parent flow form component
    if (isTriggerAction) {
      setValue(`steps.${stepIndex}.action`, {
        filterOptionId: DefaultOptionSelection.None,
        type: ActionType.TriggerStep,
        locked: false,
      });
    }
    if (!action) {
      setValue(`steps.${stepIndex}.action.filterOptionId`, DefaultOptionSelection.None);
    }
  }, [action?.type, stepIndex]);

  const error = formState.errors.steps?.[stepIndex]?.action;

  // get field options asssociated with decisions to use as action filters
  const results = getValues(`steps.${stepIndex}.result`);

  const responseFields = getValues(`steps.${stepIndex}.fieldSet.fields`);
  const filterOptions: SelectOption[] = [
    { name: "Action runs for every result", value: DefaultOptionSelection.None },
  ];

  (results ?? [])
    .filter((res) => res.type === ResultType.Decision)
    .forEach((res, resIndex) => {
      if (!responseFields) return;
      const field = responseFields.find((f) => f.fieldId === res.fieldId);
      if (!field || field.type !== FieldType.Options) {
        setValue(`steps.${stepIndex}.action.filterOptionId`, DefaultOptionSelection.None);
      } else {
        (field.optionsConfig.options ?? []).map((o) => {
          filterOptions.push({
            name: `Result ${resIndex}: "${o.name}"`,
            value: o.optionId,
          });
        });
      }
    });

  const actionFilterId = getValues(`steps.${stepIndex}.action.filterOptionId`);

  // remove linked option if that result is removed
  useEffect(() => {
    if (!filterOptions.find((option) => option.value === actionFilterId)) {
      setValue(`steps.${stepIndex}.action.filterOptionId`, DefaultOptionSelection.None);
    }
  }, [filterOptions, actionFilterId]);

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
        name={`steps.${stepIndex}.action.type`}
        label="fieldId"
        disabled={true}
        defaultValue=""
      />
      <TextField<FlowSchemaType>
        display={false}
        label="Action type"
        name={`steps.${stepIndex}.action.type`}
        size="small"
        showLabel={false}
        defaultValue=""
      />
      <TextField<FlowSchemaType>
        display={false}
        label="Action type"
        name={`steps.${stepIndex}.action.filterOptionId`}
        size="small"
        showLabel={false}
        defaultValue=""
      />
      <Select<FlowSchemaType>
        label="When to run action"
        renderValue={(val) => {
          if (val === (DefaultOptionSelection.None as string)) return "Action runs on every result";
          const optionName = getSelectOptionName(filterOptions, val as string);
          if (optionName) {
            return "Only run action on: " + optionName;
          } else "Action runs on every result";
        }}
        selectOptions={[...filterOptions]}
        defaultValue=""
        name={`steps.${stepIndex}.action.filterOptionId`}
      />
    </PanelAccordion>
    // )
  );
};
