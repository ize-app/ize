import { UseFormReturn } from "react-hook-form";
import { Select, TextField } from "../../../formFields";
import { FlowSchemaType } from "../../formValidation/flow";

import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { InputAdornment, Typography } from "@mui/material";

import { DecisionType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";
import { SelectOption } from "../../../formFields/Select";
import { DefaultOptionSelection, FieldSchemaType } from "../../formValidation/fields";
import { useEffect } from "react";
import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";

interface DecisionConfigFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  resultIndex: number;
  field: FieldSchemaType;
}

const decisionTypeOptions = (selectionType: FieldOptionsSelectionType) => {
  switch (selectionType) {
    case FieldOptionsSelectionType.Select:
      return [
        { name: "Threshold vote", value: DecisionType.NumberThreshold },
        { name: "Percentage vote", value: DecisionType.PercentageThreshold },
      ];
    case FieldOptionsSelectionType.MultiSelect:
      return [{ name: "Weighted average", value: DecisionType.WeightedAverage }];
    case FieldOptionsSelectionType.Rank:
      return [{ name: "Weighted average", value: DecisionType.WeightedAverage }];
  }
};

const weightedAverageDescription = (selectionType: FieldOptionsSelectionType) => {
  switch (selectionType) {
    case FieldOptionsSelectionType.MultiSelect:
      return "Decision will be whichever option is selected the most.";
    case FieldOptionsSelectionType.Rank:
      return "Decision is the option with the highest weighted average rank";
  }
};

export const DecisionConfigForm = ({
  formMethods,
  formIndex,
  resultIndex,
  field,
}: DecisionConfigFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.response.fields.${resultIndex}`, {
      type: FieldType.Options,
      fieldId: field.fieldId,
      name: field.name,
      required: true,
      optionsConfig: {
        options: [],
        hasRequestOptions: false,
        selectionType: FieldOptionsSelectionType.Select,
        previousStepOptions: false,
        maxSelections: 1,
        linkedResultOptions: [],
      },
    });
    // formMethods.setValue(`steps.${formIndex}.result.${resultIndex}`, {
    //   type: ResultType.Decision,
    //   fieldId: field.fieldId,
    //   resultId: "sdfasdf",
    //   minimumAnswers: 1,
    //   decision: {
    //     type: DecisionType.NumberThreshold,
    //     threshold: 1,
    //     defaultOptionId: DefaultOptionSelection.None,
    //   },
    // });
  }, []);

  const decisionType = formMethods.watch(`steps.${formIndex}.result.${resultIndex}.decision.type`);

  const defaultDecisionOptions: SelectOption[] = [
    {
      name: "No default option",
      value: DefaultOptionSelection.None,
    },
  ];

  if (field.type === FieldType.Options) {
    (field.optionsConfig.options ?? []).forEach((o) => {
      defaultDecisionOptions.push({
        name: o.name,
        value: o.optionId,
      });
    });
  }

  // if (field.type !== FieldType.Options)
  //   throw Error("Cannot set decision config for non-options field");

  return field.type === FieldType.Options ? (
    <FieldBlock>
      <Typography variant={"label2"}>Decision configuration</Typography>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={formMethods.control}
          name={`steps.${formIndex}.response.fields.${resultIndex}.optionsConfig.selectionType`}
          displayLabel={false}
          size="small"
          selectOptions={[
            {
              name: "Vote for 1 option",
              value: FieldOptionsSelectionType.Select,
            },
            {
              name: "Vote for multiple options",
              value: FieldOptionsSelectionType.MultiSelect,
            },
            {
              name: "Rank options",
              value: FieldOptionsSelectionType.Rank,
            },
          ]}
          label="How do participants select options?"
        />
        <Select<FlowSchemaType>
          control={formMethods.control}
          label="How do we determine the final result?"
          selectOptions={decisionTypeOptions(field.optionsConfig.selectionType)}
          name={`steps.${formIndex}.result.${resultIndex}.decision.type`}
          size="small"
          displayLabel={false}
        />
      </ResponsiveFormRow>
      <ResponsiveFormRow>
        {decisionType === DecisionType.NumberThreshold && (
          <TextField<FlowSchemaType>
            control={formMethods.control}
            label="Threshold votes"
            name={`steps.${formIndex}.result.${resultIndex}.decision.threshold`}
            size="small"
            showLabel={false}
            endAdornment={<InputAdornment position="end">votes to decide</InputAdornment>}
          />
        )}
        {decisionType === DecisionType.PercentageThreshold && (
          <TextField<FlowSchemaType>
            control={formMethods.control}
            sx={{ width: "200px" }}
            label="Percentage votes"
            size="small"
            showLabel={false}
            name={`steps.${formIndex}.result.${resultIndex}.decision.threshold`}
            endAdornment={<InputAdornment position="end">% of votes to win</InputAdornment>}
          />
        )}
        <TextField<FlowSchemaType>
          control={formMethods.control}
          label="Minimum # of responses for a result"
          showLabel={false}
          size={"small"}
          endAdornment={<InputAdornment position="end">responses minimum to decide</InputAdornment>}
          name={`steps.${formIndex}.result.${resultIndex}.minimumAnswers`}
        />
      </ResponsiveFormRow>
      {/* <Typography>{weightedAverageDescription(field.optionsConfig.selectionType)}</Typography> */}
      <Select<FlowSchemaType>
        control={formMethods.control}
        label="Default option"
        sx={{
          "& > input": {
            fontWeight: "800",
            color: "red",
          },
        }}
        renderValue={(val) => {
          if (val === DefaultOptionSelection.None) return "If no decision, no default result";
          const option = defaultDecisionOptions.find((option) => option.value === val);
          if (option) {
            return "Default result if no decision: " + option.name;
          } else return "No default result";
        }}
        selectOptions={defaultDecisionOptions}
        displayLabel={false}
        name={`steps.${formIndex}.result.${resultIndex}.decision.defaultOptionId`}
      />
    </FieldBlock>
  ) : null;
};
