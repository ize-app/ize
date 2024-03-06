import { UseFormReturn } from "react-hook-form";
import { Select, TextField } from "../../../FormFields";
import { FlowSchemaType } from "../../formValidation/flow";

import { ResponsiveFormRow } from "../ResponsiveFormRow";
import { InputAdornment } from "@mui/material";

import { DecisionType, FieldType, ResultType } from "@/graphql/generated/graphql";
import { useEffect } from "react";
import { SelectOption } from "../../../FormFields/Select";
import { DefaultOptionSelection, FieldSchemaType } from "../../formValidation/fields";

interface DecisionConfigFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  resultIndex: number;
  field: FieldSchemaType;
}

export const DecisionConfigForm = ({
  formMethods,
  formIndex,
  resultIndex,
  field,
}: DecisionConfigFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.results.${resultIndex}`, {
      type: ResultType.Decision,
      fieldId: field.fieldId,
      minimumAnswers: 1,
      decision: {
        type: DecisionType.NumberThreshold,
        threshold: 1,
        defaultOptionId: DefaultOptionSelection.None,
      },
    });
  }, []);

  const decisionType = formMethods.watch(`steps.${formIndex}.results.${resultIndex}.decision.type`);

  const defaultDecisionOptions: SelectOption[] = [
    {
      name: "No default option",
      value: DefaultOptionSelection.None,
    },
  ];

  if (field.type === FieldType.Options) {
    field.optionsConfig.options.forEach((o) => {
      defaultDecisionOptions.push({
        name: o.name,
        value: o.optionId,
      });
    });
  }

  return (
    <>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={formMethods.control}
          label="How do we determine the final result?"
          width="200px"
          selectOptions={[
            {
              name: "Threshold vote",
              value: DecisionType.NumberThreshold,
            },
            {
              name: "Percentage vote",
              value: DecisionType.PercentageThreshold,
            },
          ]}
          name={`steps.${formIndex}.results.${resultIndex}.decision.type`}
          size="small"
          displayLabel={false}
        />

        {decisionType === DecisionType.NumberThreshold && (
          <TextField<FlowSchemaType>
            control={formMethods.control}
            width="200px"
            label="Threshold votes"
            name={`steps.${formIndex}.results.${resultIndex}.decision.threshold`}
            size="small"
            variant="standard"
            showLabel={false}
            endAdornment={<InputAdornment position="end">votes to win</InputAdornment>}
          />
        )}
        {decisionType === DecisionType.PercentageThreshold && (
          <TextField<FlowSchemaType>
            control={formMethods.control}
            width="200px"
            label="Percentage votes"
            size="small"
            variant="standard"
            showLabel={false}
            name={`steps.${formIndex}.results.${resultIndex}.decision.threshold`}
            endAdornment={<InputAdornment position="end">% of votes to win</InputAdornment>}
          />
        )}
        <TextField<FlowSchemaType>
          control={formMethods.control}
          width="200px"
          label="Minimum # of responses for a result"
          showLabel={false}
          variant="standard"
          size={"small"}
          endAdornment={<InputAdornment position="end">responses minimum</InputAdornment>}
          name={`steps.${formIndex}.results.${resultIndex}.minimumAnswers`}
        />
      </ResponsiveFormRow>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={formMethods.control}
          label="Default option"
          width="200px"
          renderValue={(val) => {
            if (val === DefaultOptionSelection.None)
              return "If there is no decision, there is no result.";
            const option = defaultDecisionOptions.find((option) => option.value === val);
            if (option) {
              return "Default result if no decision: " + option.name;
            } else return "No default result";
          }}
          selectOptions={defaultDecisionOptions}
          displayLabel={false}
          flexGrow="1"
          name={`steps.${formIndex}.results.${resultIndex}.decision.defaultOptionId`}
        />
      </ResponsiveFormRow>
    </>
  );
};
