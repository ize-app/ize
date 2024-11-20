import Box from "@mui/material/Box";

import {
  RequestStepFragment,
  ResultGroupFragment,
  StepFragment,
} from "@/graphql/generated/graphql";

import { Result } from "../../result/Results/Result";

export const RequestStepResults = ({
  step,
  requestStep,
}: {
  step: StepFragment;
  requestStep: RequestStepFragment | null;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {step.result.map((resultConfig) => {
        const field = requestStep
          ? requestStep.fieldSet.fields.find((f) => f.fieldId === resultConfig.field.fieldId)
          : null;
        const result: ResultGroupFragment | null =
          (requestStep?.results ?? []).find(
            (r) => r.resultConfigId === resultConfig.resultConfigId,
          ) ?? null;

        const responseSummary =
          (requestStep?.responseFieldAnswers ?? []).find(
            (r) => r.field.fieldId === resultConfig.field.fieldId,
          )?.summary ?? null;

        return (
          <Result
            field={field ?? resultConfig.field}
            key={resultConfig.resultConfigId}
            resultConfig={resultConfig}
            resultGroup={result}
            responseSummary={responseSummary}
            minResponses={step.response?.minResponses}
            displayDescripton={true}
          />
        );
      })}
    </Box>
  );
};
