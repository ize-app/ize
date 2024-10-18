import { Box } from "@mui/material";

import { determineRequestStepStatus } from "@/components/ConfigDiagram/ConfigDiagramRequest/determineRequestStepStatus";
import {
  FieldFragment,
  RequestFragment,
  ResultConfigFragment,
  ResultGroupFragment,
  Status,
} from "@/graphql/generated/graphql";

import { Result } from "./Result";

interface HydratedResultData {
  field: FieldFragment;
  resultConfig: ResultConfigFragment;
  resultGroup: ResultGroupFragment | null;
  requestStepStatus: Status;
}

// lists all results from a given request
export const RequestResults = ({ request }: { request: RequestFragment }) => {
  const hydratedResults: HydratedResultData[] = [];

  request.flow.steps.forEach((step, stepIndex) => {
    const requestStepStatus = determineRequestStepStatus(
      stepIndex,
      request.requestSteps[stepIndex]?.status.resultsFinal ?? false,
      request.currentStepIndex,
      request.final,
    );

    step.result.forEach((resultConfig) => {
      const responseField = request.requestSteps[stepIndex]?.fieldSet.fields.find(
        (field) => field.fieldId === resultConfig.fieldId,
      );
      const field =
        responseField ??
        step.fieldSet.fields.find((field) => field.fieldId === resultConfig.fieldId);
      const resultGroup =
        request.requestSteps[stepIndex]?.results.find(
          (result) => result.resultConfigId === resultConfig.resultConfigId,
        ) ?? null;
      if (field) hydratedResults.push({ field, resultConfig, resultGroup, requestStepStatus });
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
