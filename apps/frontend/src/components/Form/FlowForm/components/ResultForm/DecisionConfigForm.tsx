import { InputAdornment, Typography } from "@mui/material";
import { useEffect } from "react";
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

const selectTypeOptions = (decisionType: DecisionType) => {
  const selectOne = {
    name: "Vote for 1 option",
    value: FieldOptionsSelectionType.Select,
  };
  const multiSelect = {
    name: "Vote for multiple options",
    value: FieldOptionsSelectionType.MultiSelect,
  };
  const rank = {
    name: "Rank options",
    value: FieldOptionsSelectionType.Rank,
  };

  switch (decisionType) {
    case DecisionType.NumberThreshold:
      return [selectOne];
    case DecisionType.PercentageThreshold:
      return [selectOne];
    case DecisionType.WeightedAverage:
      return [multiSelect, rank];
    case DecisionType.Ai:
      return [];
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
  const decisionType = formMethods.watch(`steps.${formIndex}.result.${resultIndex}.decision.type`);

  useEffect(() => {
    if (decisionType) {
      if (decisionType === DecisionType.WeightedAverage) {
        formMethods.setValue(
          `steps.${formIndex}.fieldSet.fields.${resultIndex}.optionsConfig.selectionType`,
          FieldOptionsSelectionType.Rank,
        );
        formMethods.setValue(
          `steps.${formIndex}.fieldSet.fields.${resultIndex}.optionsConfig.maxSelections`,
          2,
        );
      } else {
        formMethods.setValue(
          `steps.${formIndex}.fieldSet.fields.${resultIndex}.optionsConfig.selectionType`,
          FieldOptionsSelectionType.Select,
        );
      }

      if (decisionType === DecisionType.Ai) {
        formMethods.setValue(
          `steps.${formIndex}.result.${resultIndex}.decision.defaultOptionId`,
          DefaultOptionSelection.None,
        );
        formMethods.setValue(`steps.${formIndex}.fieldSet.fields.${resultIndex}.isInternal`, true);
        formMethods.setValue(`steps.${formIndex}.result.${resultIndex}.minimumAnswers`, 0);
      } else {
        formMethods.setValue(`steps.${formIndex}.fieldSet.fields.${resultIndex}.isInternal`, false);
        formMethods.setValue(`steps.${formIndex}.result.${resultIndex}.minimumAnswers`, 2);
      }
    }
  }, [decisionType]);

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
          label="How do we determine the final result?"
          selectOptions={[
            { name: "Threshold vote", value: DecisionType.NumberThreshold },
            { name: "Percentage vote", value: DecisionType.PercentageThreshold },
            {
              name: "Weighted average of multiple selections",
              value: DecisionType.WeightedAverage,
            },
            { name: "AI decides", value: DecisionType.Ai },
          ]}
          defaultValue=""
          name={`steps.${formIndex}.result.${resultIndex}.decision.type`}
          size="small"
        />
        <Select<FlowSchemaType>
          name={`steps.${formIndex}.fieldSet.fields.${resultIndex}.optionsConfig.selectionType`}
          size="small"
          defaultValue=""
          display={decisionType !== DecisionType.Ai}
          selectOptions={selectTypeOptions(decisionType)}
          label="How do participants select options?"
        />
      </ResponsiveFormRow>
      <ResponsiveFormRow>
        {
          <TextField<FlowSchemaType>
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
          label="Minimum # of responses for a result"
          showLabel={false}
          size={"small"}
          display={decisionType !== DecisionType.Ai}
          defaultValue=""
          endAdornment={<InputAdornment position="end">responses minimum</InputAdornment>}
          name={`steps.${formIndex}.result.${resultIndex}.minimumAnswers`}
        />
        <TextField<FlowSchemaType>
          label="What criteria should the AI use to make a decision?"
          placeholderText="What criteria should the AI use to make a decision?"
          showLabel={false}
          size={"small"}
          display={decisionType === DecisionType.Ai}
          defaultValue=""
          name={`steps.${formIndex}.result.${resultIndex}.decision.criteria`}
        />
      </ResponsiveFormRow>
      {/* <Typography>{weightedAverageDescription(field.optionsConfig.selectionType)}</Typography> */}
      <Select<FlowSchemaType>
        label="Default option"
        sx={{
          "& > input": {
            fontWeight: "800",
            color: "red",
          },
        }}
        defaultValue=""
        display={decisionType !== DecisionType.Ai}
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
