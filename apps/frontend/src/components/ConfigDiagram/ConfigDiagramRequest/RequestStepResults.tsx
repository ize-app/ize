import Box from "@mui/material/Box";

import {
  ResultConfigFragment,
  ResultGroupFragment,
  Status,
} from "@/graphql/generated/graphql";

import { Result } from "../../result/Results/Result";

export const RequestStepResults = ({
  resultConfigs,
  results,
  requestStatus,
}: {
  resultConfigs: ResultConfigFragment[];
  results: ResultGroupFragment[];
  requestStatus: Status;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {resultConfigs.map((resultConfig) => {
        const result: ResultGroupFragment | null =
          results.find((r) => r.resultConfigId === resultConfig.resultConfigId) ?? null;

        return (
          <Result
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
