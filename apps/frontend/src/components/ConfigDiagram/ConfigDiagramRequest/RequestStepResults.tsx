import Box from "@mui/material/Box";

import {
  RequestStepFragment,
  ResultConfigFragment,
  ResultGroupFragment,
  Status,
} from "@/graphql/generated/graphql";

import { Result } from "../../result/Results/Result";

export const RequestStepResults = ({
  resultConfigs,
  results,
  requestStatus,
  requestStep,
}: {
  resultConfigs: ResultConfigFragment[];
  results: ResultGroupFragment[];
  requestStatus: Status;
  requestStep: RequestStepFragment | null;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {resultConfigs.map((resultConfig) => {
        const field = requestStep
          ? requestStep.fieldSet.fields.find((f) => f.fieldId === resultConfig.field.fieldId)
          : null;
        const result: ResultGroupFragment | null =
          results.find((r) => r.resultConfigId === resultConfig.resultConfigId) ?? null;

        return (
          <Result
            field={field ?? resultConfig.field}
            key={resultConfig.resultConfigId}
            resultConfig={resultConfig}
            resultGroup={result}
            requestStepStatus={requestStatus}
            displayDescripton={true}
          />
        );
      })}
    </Box>
  );
};
