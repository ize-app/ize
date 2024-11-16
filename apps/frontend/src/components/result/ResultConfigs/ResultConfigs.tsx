import Box from "@mui/material/Box";

import { StepFragment } from "@/graphql/generated/graphql";

import { ResultConfig } from "./ResultConfig";
import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";

export const ResultConfigs = ({ step }: { step: StepFragment }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {step.result.map((resultConfig) => {
        return (
          <LabeledGroupedInputs sx={{ padding: "16px" }} key={resultConfig.resultConfigId}>
            <ResultConfig resultConfig={resultConfig} minResponses={step.response?.minResponses} />
          </LabeledGroupedInputs>
        );
      })}
    </Box>
  );
};
