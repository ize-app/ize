import Box from "@mui/material/Box";

import { ResultConfigFragment } from "@/graphql/generated/graphql";

import { ResultConfig } from "./ResultConfig";
import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";

export const ResultConfigs = ({ resultConfigs }: { resultConfigs: ResultConfigFragment[] }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {resultConfigs.map((resultConfig) => {
        return (
          <LabeledGroupedInputs sx={{ padding: "16px" }} key={resultConfig.resultConfigId}>
            <ResultConfig resultConfig={resultConfig} />
          </LabeledGroupedInputs>
        );
      })}
    </Box>
  );
};
