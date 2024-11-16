import { InputAdornment } from "@mui/material";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import { FieldBlock } from "@/components/Form/formLayout/FieldBlock";
import { DecisionType, FieldOptionsSelectionType, FieldType } from "@/graphql/generated/graphql";

import { Select, TextField } from "../../../formFields";
import { SelectOption } from "../../../formFields/Select";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { DefaultOptionSelection, FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";

interface DecisionConfigFormProps {
  stepIndex: number; // react-hook-form name
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
  stepIndex,
  resultIndex,
  field,
  display = true,
}: DecisionConfigFormProps) => {
  const { watch, setValue } = useFormContext<FlowSchemaType>();
  const decisionType = watch(`steps.${stepIndex}.result.${resultIndex}.decision.type`);

  useEffect(() => {
    if (decisionType) {
      if (decisionType === DecisionType.WeightedAverage) {
        setValue(
          `steps.${stepIndex}.fieldSet.fields.${resultIndex}.optionsConfig.selectionType`,
          FieldOptionsSelectionType.Rank,
        );
        setValue(
          `steps.${stepIndex}.fieldSet.fields.${resultIndex}.optionsConfig.maxSelections`,
          2,
        );
      } else {
        setValue(
          `steps.${stepIndex}.fieldSet.fields.${resultIndex}.optionsConfig.selectionType`,
          FieldOptionsSelectionType.Select,
        );
      }

      if (decisionType === DecisionType.Ai) {
        setValue(
          `steps.${stepIndex}.result.${resultIndex}.decision.defaultOptionId`,
          DefaultOptionSelection.None,
        );
        setValue(`steps.${stepIndex}.fieldSet.fields.${resultIndex}.isInternal`, true);
      } else {
        setValue(`steps.${stepIndex}.fieldSet.fields.${resultIndex}.isInternal`, false);
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
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          label="How do we determine the final result?"
          selectOptions={[
            { name: "Threshold vote", value: DecisionType.NumberThreshold },
            { name: "Percentage vote", value: DecisionType.PercentageThreshold },
            {
              name: "Weighted average of votes",
              value: DecisionType.WeightedAverage,
            },
            { name: "AI decides", value: DecisionType.Ai },
          ]}
          defaultValue=""
          name={`steps.${stepIndex}.result.${resultIndex}.decision.type`}
          size="small"
        />
        {decisionType === DecisionType.NumberThreshold && (
          <TextField<FlowSchemaType>
            label="Threshold votes"
            name={`steps.${stepIndex}.result.${resultIndex}.decision.threshold`}
            size="small"
            sx={{ width: "200px" }}
            showLabel={false}
            defaultValue=""
            endAdornment={<InputAdornment position="end">votes to decide</InputAdornment>}
          />
        )}

        {decisionType === DecisionType.PercentageThreshold && (
          <TextField<FlowSchemaType>
            sx={{ width: "200px" }}
            label="Percentage votes"
            size="small"
            showLabel={false}
            defaultValue=""
            name={`steps.${stepIndex}.result.${resultIndex}.decision.threshold`}
            endAdornment={<InputAdornment position="end">% of votes to win</InputAdornment>}
          />
        )}

        {decisionType === DecisionType.WeightedAverage && (
          <Select<FlowSchemaType>
            name={`steps.${stepIndex}.fieldSet.fields.${resultIndex}.optionsConfig.selectionType`}
            size="small"
            sx={{ width: "200px" }}
            defaultValue=""
            selectOptions={selectTypeOptions(decisionType)}
            label="How do participants select options?"
          />
        )}
        {decisionType === DecisionType.Ai && (
          <TextField<FlowSchemaType>
            label="What criteria should the AI use to make a decision?"
            placeholderText="What criteria should the AI use to make a decision?"
            showLabel={false}
            size={"small"}
            defaultValue=""
            name={`steps.${stepIndex}.result.${resultIndex}.decision.criteria`}
          />
        )}
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
        name={`steps.${stepIndex}.result.${resultIndex}.decision.defaultOptionId`}
      />
    </FieldBlock>
  );
};
