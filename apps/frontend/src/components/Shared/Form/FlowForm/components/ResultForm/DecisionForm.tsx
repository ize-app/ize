import { UseFormReturn } from "react-hook-form";
import { Select, TextField } from "../../../FormFields";
import { FlowSchemaType } from "../../formValidation/flow";

import { ResponsiveFormRow } from "../ResponsiveFormRow";
import { InputAdornment } from "@mui/material";

import { DecisionType, ResultType } from "@/graphql/generated/graphql";
import { useEffect } from "react";
import { FieldOptionSchemaType } from "../../formValidation/fields";

interface DecisionFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

export const DecisionForm = ({ formMethods, formIndex }: DecisionFormProps) => {
  useEffect(() => {
    formMethods.setValue(`steps.${formIndex}.result.type`, ResultType.Decision);
  }, []);

  const decisionType = formMethods.watch(`steps.${formIndex}.result.decision.type`);

  const options = formMethods.watch(`steps.${formIndex}.response.field.optionsConfig.options`);

  const defaultOptionSelections = (options ?? []).map((option: FieldOptionSchemaType) => {
    return {
      name: option.name,
      value: option.optionId,
    };
  });

  defaultOptionSelections.unshift({
    name: "No default option",
    value: "None",
  });

  return (
    <>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          control={formMethods.control}
          label="How do we determine the final result?"
          width="300px"
          selectOptions={[
            {
              name: "When an option gets x # of votes",
              value: DecisionType.NumberThreshold,
            },
            {
              name: "When an option gets x % of votes",
              value: DecisionType.PercentageThreshold,
            },
          ]}
          name={`steps.${formIndex}.result.decision.type`}
          size="small"
          displayLabel={false}
        />

        {decisionType === DecisionType.NumberThreshold && (
          <TextField<FlowSchemaType>
            control={formMethods.control}
            width="300px"
            label="Threshold votes"
            name={`steps.${formIndex}.result.decision.threshold`}
            size="small"
            variant="standard"
            showLabel={false}
            endAdornment={<InputAdornment position="end">votes to win</InputAdornment>}
          />
        )}
        {decisionType === DecisionType.PercentageThreshold && (
          <TextField<FlowSchemaType>
            control={formMethods.control}
            width="300px"
            label="Option selected with"
            size="small"
            variant="standard"
            showLabel={false}
            name={`steps.${formIndex}.result.decision.threshold`}
            endAdornment={<InputAdornment position="end">% of responses</InputAdornment>}
          />
        )}
        {(options ?? []).length > 0 && (
          <Select<FlowSchemaType>
            control={formMethods.control}
            label="Default option"
            width="300px"
            renderValue={(val) => {
              const option = options.find((option) => option.optionId === val);
              if (option) {
                return "Default result: " + option.name;
              } else return "No default result";
            }}
            selectOptions={defaultOptionSelections}
            displayLabel={false}
            name={`steps.${formIndex}.result.decision.defaultOptionId`}
          />
        )}
      </ResponsiveFormRow>
    </>
  );
};
