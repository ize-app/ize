import { UseFormReturn } from "react-hook-form";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { ResultDecisionType, ResultFreeText, StepType } from "../types";
import { Select, Switch, TextField } from "../../FormFields";
import { responseOptionSchema } from "../formSchema";

import { StepComponentContainer } from "./StepContainer";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { InputAdornment, Typography } from "@mui/material";

import * as z from "zod";

type ResponseOptionType = z.infer<typeof responseOptionSchema>;

interface ResultFormProps {
  formMethods: UseFormReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

const getInputStepHeader = (stepType: StepType) => {
  switch (stepType) {
    case StepType.Decide:
      return "How is a decision reached?";
    case StepType.Prioritize:
      return "How is the priority determined?";
    case StepType.GetInput:
      return "How is the final output created?";
  }
};

export const ResultForm = ({ formMethods, formIndex }: ResultFormProps) => {
  const stepType = formMethods.watch(`steps.${formIndex}.respond.inputs.type`);

  const decisionType = formMethods.watch(`steps.${formIndex}.result.decision.type`);
  const hasDefaultOption = formMethods.watch(
    `steps.${formIndex}.result.decision.defaultOption.hasDefault`,
  );
  const isFreeTextAiSummary =
    formMethods.watch(`steps.${formIndex}.result.freeText.type`) === ResultFreeText.AiSummary;

  const options = formMethods.watch(`steps.${formIndex}.respond.inputs.options.options`);

  const onlyIncludePrioritizedTopOptions = formMethods.watch(
    `steps.${formIndex}.result.priority.onlyIncludeTopOptions`,
  );

  return (
    <StepComponentContainer label={getInputStepHeader(stepType)}>
      {stepType && (
        <>
          <ResponsiveFormRow>
            {stepType === StepType.Decide && (
              <>
                <Select<NewFlowFormFields>
                  control={formMethods.control}
                  label="How do we determine the final result?"
                  width="300px"
                  selectOptions={[
                    {
                      name: "An option gets X # of votes",
                      value: ResultDecisionType.ThresholdVote,
                    },
                    {
                      name: "An option gets X % of votes",
                      value: ResultDecisionType.PercentageVote,
                    },
                  ]}
                  name={`steps.${formIndex}.result.decision.type`}
                />

                {decisionType === ResultDecisionType.ThresholdVote && (
                  <TextField<NewFlowFormFields>
                    control={formMethods.control}
                    width="300px"
                    label="Threshold votes"
                    variant="outlined"
                    name={`steps.${formIndex}.result.decision.threshold.decisionThresholdCount`}
                  />
                )}
                {decisionType === ResultDecisionType.PercentageVote && (
                  <TextField<NewFlowFormFields>
                    control={formMethods.control}
                    width="300px"
                    label="Option selected with"
                    variant="outlined"
                    name={`steps.${formIndex}.result.decision.percentage.decisionThresholdPercentage`}
                    endAdornment={<InputAdornment position="end">% of responses</InputAdornment>}
                  />
                )}
              </>
            )}
          </ResponsiveFormRow>
          {stepType === StepType.Prioritize && (
            <>
              <Typography>
                Result will be list of options, ordered by weighted average rank.
              </Typography>
              <ResponsiveFormRow>
                <Switch<NewFlowFormFields>
                  name={`steps.${formIndex}.result.priority.onlyIncludeTopOptions`}
                  control={formMethods.control}
                  label="Restrict result to top options"
                />
                {onlyIncludePrioritizedTopOptions && (
                  <TextField<NewFlowFormFields>
                    control={formMethods.control}
                    width="300px"
                    label="# of options in final result"
                    variant="outlined"
                    name={`steps.${formIndex}.result.priority.numOptionsToInclude`}
                  />
                )}
              </ResponsiveFormRow>
            </>
          )}
          {stepType === StepType.GetInput && (
            <ResponsiveFormRow>
              <Select<NewFlowFormFields>
                control={formMethods.control}
                label="What's the final result?"
                width="300px"
                selectOptions={[
                  { name: "Raw responses", value: ResultFreeText.RawResponses },
                  { name: "AI summary of responses", value: ResultFreeText.AiSummary },
                ]}
                name={`steps.${formIndex}.result.freeText.type`}
              />
              {isFreeTextAiSummary && (
                <TextField<NewFlowFormFields>
                  control={formMethods.control}
                  width="600px"
                  label="Prompt to help AI summarize responses"
                  variant="outlined"
                  name={`steps.${formIndex}.result.freeText.aiSummary.prompt`}
                />
              )}
            </ResponsiveFormRow>
          )}
          <ResponsiveFormRow>
            {(options ?? []).length > 0 && stepType === StepType.Decide && (
              <Switch<NewFlowFormFields>
                name={`steps.${formIndex}.result.decision.defaultOption.hasDefault`}
                control={formMethods.control}
                label="If there's no decision, choose a default option as the final result"
              />
            )}
            {hasDefaultOption && (
              <Select<NewFlowFormFields>
                control={formMethods.control}
                label="Default option"
                width="300px"
                selectOptions={(options ?? []).map((option: ResponseOptionType) => {
                  return {
                    name: option.name,
                    value: option.optionId,
                  };
                })}
                name={`steps.${formIndex}.result.decision.defaultOption.optionId`}
              />
            )}
          </ResponsiveFormRow>

          {/* <ResponsiveFormRow></ResponsiveFormRow> */}
        </>
      )}
    </StepComponentContainer>
  );
};
