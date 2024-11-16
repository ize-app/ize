import Box from "@mui/material/Box";

import {
  RequestStepFragment,
  ResultGroupFragment,
  Status,
  StepFragment,
} from "@/graphql/generated/graphql";

import { Result } from "../../result/Results/Result";

export const RequestStepResults = ({
  step,
  requestStatus,
  requestStep,
}: {
  step: StepFragment;
  requestStatus: Status;
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

        return (
          <Result
            field={field ?? resultConfig.field}
            key={resultConfig.resultConfigId}
            resultConfig={resultConfig}
            resultGroup={result}
            minResponses={step.response?.minResponses}
            requestStepStatus={requestStatus}
            displayDescripton={true}
          />
        );
      })}
    </Box>
  );
};
