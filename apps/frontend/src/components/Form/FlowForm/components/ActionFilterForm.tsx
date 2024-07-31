import { FormHelperText } from "@mui/material";
import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";

import { ActionType, FieldType, ResultType } from "@/graphql/generated/graphql";

import { PanelAccordion } from "../../../ConfigDiagram/ConfigPanel/PanelAccordion";
import { Select, TextField } from "../../formFields";
import { SelectOption } from "../../formFields/Select";
import { getSelectOptionName } from "../../utils/getSelectOptionName";
import { ActionSchemaType } from "../formValidation/action";
import { DefaultOptionSelection } from "../formValidation/fields";
import { FlowSchemaType } from "../formValidation/flow";

interface ActionFilterFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  action: ActionSchemaType | undefined;
  isTriggerAction?: boolean;
}

export const ActionFilterForm = ({
  formMethods,
  formIndex,
  action,
  isTriggerAction = false,
}: ActionFilterFormProps) => {
  useEffect(() => {
    // formMethods.setValue(`steps.${formIndex}.action`, {
    //   filterOptionId: DefaultOptionSelection.None,
    //   // type: actionType,
    // });
    if (isTriggerAction) {
      formMethods.setValue(`steps.${formIndex}.action`, {
        filterOptionId: DefaultOptionSelection.None,
        type: ActionType.TriggerStep,
        locked: false,
      });
    }
    if (!action || (action.type !== ActionType.None && !action.filterOptionId)) {
      formMethods.setValue(`steps.${formIndex}.action.filterOptionId`, DefaultOptionSelection.None);
    }
  }, [action, formIndex, formMethods]);

  const error = formMethods.formState.errors.steps?.[formIndex]?.action;

  // get field options asssociated with decisions to use as action filters
  const results = formMethods.watch(`steps.${formIndex}.result`);
  const responseFields = formMethods.watch(`steps.${formIndex}.response.fields`);
  const filterOptions: SelectOption[] = [
    { name: "Action runs for every result", value: DefaultOptionSelection.None },
  ];

  // if (!results)
  //   formMethods
  //     .setValue(
  //       `steps.${formIndex}.action.filterOptionId`,
  //       DefaultOptionSelection.None,
  //     )
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
        defaultValue=""
        name={`steps.${formIndex}.action.filterOptionId`}
      />
    </PanelAccordion>
    // )
  );
};
