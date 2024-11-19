import { Box } from "@mui/material";

import {
  FieldFragment,
  RequestFragment,
  ResultConfigFragment,
  ResultGroupFragment,
} from "@/graphql/generated/graphql";

import { Result } from "./Result";

interface HydratedResultData {
  resultConfig: ResultConfigFragment;
  resultGroup: ResultGroupFragment | null;
  field: FieldFragment;
  minResponses: number | undefined | null;
}

// lists all results from a given request
export const RequestResults = ({ request }: { request: RequestFragment }) => {
  const hydratedResults: HydratedResultData[] = [];

  request.flow.steps.forEach((step, stepIndex) => {
    step.result.forEach((resultConfig) => {
      const resultGroup =
        request.requestSteps[stepIndex]?.results.find(
          (result) => result.resultConfigId === resultConfig.resultConfigId,
        ) ?? null;

      const field =
        request.requestSteps[stepIndex]?.fieldSet.fields.find(
          (field) => field.fieldId === resultConfig.field.fieldId,
        ) ?? resultConfig.field;
      if (!field) throw Error("Missing field for resultConfig");
      hydratedResults.push({
        resultConfig,
        resultGroup,
        field,
        minResponses: step.response?.minResponses,
      });
    });
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {hydratedResults.map((resultData) => (
        <Result
          key={resultData.resultConfig.resultConfigId}
          {...resultData}
          displayDescripton={false}
          onlyShowSelections={true}
          displayFieldOptionsIfNoResult={false}
        />
      ))}
    </Box>
  );
};
