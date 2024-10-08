import { InputAdornment, Typography } from "@mui/material";
import { UseFormReturn } from "react-hook-form";

import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";
import { DecisionType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { Select, TextField } from "../../../formFields";
import { SelectOption } from "../../../formFields/Select";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { DefaultOptionSelection, FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";

interface DecisionConfigFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  resultIndex: number;
  field: FieldSchemaType;
  display?: boolean;
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

// const weightedAverageDescription = (selectionType: FieldOptionsSelectionType) => {
//   switch (selectionType) {
//     case FieldOptionsSelectionType.MultiSelect:
//       return "Decision will be whichever option is selected the most.";
//     case FieldOptionsSelectionType.Rank:
//       return "Decision is the option with the highest weighted average rank";
//   }
// };

export const DecisionConfigForm = ({
  formMethods,
  formIndex,
  resultIndex,
  field,
  display = true,
}: DecisionConfigFormProps) => {
  const decisionType = formMethods.getValues(
    `steps.${formIndex}.result.${resultIndex}.decision.type`,
  );

  const defaultDecisionOptions: SelectOption[] = [
    {
      name: "No default option",
      value: DefaultOptionSelection.None,
    },
  ];

  if (field.type === FieldType.Options) {
    (field.optionsConfig.options ?? []).forEach((o) => {
      defaultDecisionOptions.push({
        // TODO: revisit this - will probably cause errors
        name: o.name as string,
        value: o.optionId,
      });
    });
  }

  return (
    <FieldBlock sx={{ display: display ? "flex" : "none" }}>
      <Typography variant={"label2"}>Decision configuration</Typography>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={formMethods.control}
          name={`steps.${formIndex}.response.fields.${resultIndex}.optionsConfig.selectionType`}
          size="small"
          defaultValue=""
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
          selectOptions={
            field.type === FieldType.Options
              ? decisionTypeOptions(field.optionsConfig?.selectionType)
              : []
          }
          defaultValue=""
          name={`steps.${formIndex}.result.${resultIndex}.decision.type`}
          size="small"
        />
      </ResponsiveFormRow>
      <ResponsiveFormRow>
        {
          <TextField<FlowSchemaType>
            control={formMethods.control}
            display={decisionType === DecisionType.NumberThreshold}
            label="Threshold votes"
            name={`steps.${formIndex}.result.${resultIndex}.decision.threshold`}
            size="small"
            showLabel={false}
            defaultValue=""
            endAdornment={<InputAdornment position="end">votes to decide</InputAdornment>}
          />
        }
        {
          <TextField<FlowSchemaType>
            control={formMethods.control}
            display={decisionType === DecisionType.PercentageThreshold}
            sx={{ width: "200px" }}
            label="Percentage votes"
            size="small"
            showLabel={false}
            defaultValue=""
            name={`steps.${formIndex}.result.${resultIndex}.decision.threshold`}
            endAdornment={<InputAdornment position="end">% of votes to win</InputAdornment>}
          />
        }
        <TextField<FlowSchemaType>
          control={formMethods.control}
          label="Minimum # of responses for a result"
          showLabel={false}
          size={"small"}
          defaultValue=""
          endAdornment={<InputAdornment position="end">responses minimum</InputAdornment>}
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
        defaultValue=""
        renderValue={(val) => {
          if (val === DefaultOptionSelection.None) return "If no decision, no default result";
          const option = defaultDecisionOptions.find((option) => option.value === val);
          if (option) {
            return "Default result if no decision: " + option.name;
          } else return "No default result";
        }}
        selectOptions={defaultDecisionOptions}
        name={`steps.${formIndex}.result.${resultIndex}.decision.defaultOptionId`}
      />
    </FieldBlock>
  );
};
