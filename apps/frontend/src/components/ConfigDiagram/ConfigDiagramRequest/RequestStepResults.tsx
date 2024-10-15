import Box from "@mui/material/Box";

import {
  FieldFragment,
  ResultConfigFragment,
  ResultGroupFragment,
  Status,
} from "@/graphql/generated/graphql";

import { Result } from "../../result/Results/Result";

export const RequestStepResults = ({
  resultConfigs,
  responseFields,
  results,
  requestStatus,
}: {
  resultConfigs: ResultConfigFragment[];
  responseFields: FieldFragment[];
  results: ResultGroupFragment[];
  requestStatus: Status;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {resultConfigs.map((resultConfig) => {
        let field: FieldFragment | null = null;
        const result: ResultGroupFragment | null =
          results.find((r) => r.resultConfigId === resultConfig.resultConfigId) ?? null;

        if (resultConfig.fieldId) {
          field = responseFields.find((field) => field.fieldId === resultConfig.fieldId) ?? null;
        }

        return (
          <Result
            key={resultConfig.resultConfigId}
            resultConfig={resultConfig}
            resultGroup={result}
            field={field}
            requestStepStatus={requestStatus}
            displayDescripton={true}
          />
        );
      })}
    </Box>
  );
};
