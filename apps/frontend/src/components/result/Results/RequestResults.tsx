import { Box } from "@mui/material";

import {
  FieldFragment,
  OptionFragment,
  RequestFragment,
  RequestStepFragment,
  ResponseFieldAnswersSummary,
  ResultConfigFragment,
  ResultGroupFragment,
} from "@/graphql/generated/graphql";

import { Result } from "./Result";

interface HydratedResultData {
  resultConfig: ResultConfigFragment;
  resultGroup: ResultGroupFragment | null;
  field: FieldFragment;
  minResponses: number | undefined | null;
  responseSummary: ResponseFieldAnswersSummary | null;
  triggerDefinedOptions?: OptionFragment[];
  finalField: boolean;
  finalResult: boolean;
}

// lists all results from a given request
export const RequestResults = ({ request }: { request: RequestFragment }) => {
  const hydratedResults: HydratedResultData[] = [];

  request.flow.steps.forEach((step, stepIndex) => {
    step.result.forEach((resultConfig) => {
      const reqStep: RequestStepFragment | null = request.requestSteps[stepIndex];
      const resultGroup =
        reqStep?.results.find((result) => result.resultConfigId === resultConfig.resultConfigId) ??
        null;

      const field =
        reqStep?.fieldSet.fields.find((field) => field.fieldId === resultConfig.field.fieldId) ??
        resultConfig.field;

      const responseSummary =
        reqStep?.answers.find((r) => r.field.fieldId === resultConfig.field.fieldId)?.summary ??
        null;

      const triggerDefinedOptions = request.triggerDefinedOptions.find(
        (t) => t.fieldId === resultConfig.field.fieldId,
      )?.options;

      const finalField = !!reqStep;

      if (!field) throw Error("Missing field for resultConfig");
      hydratedResults.push({
        resultConfig,
        resultGroup,
        field,
        responseSummary,
        minResponses: step.response?.minResponses,
        triggerDefinedOptions,
        finalField,
        finalResult: (reqStep?.status.resultsFinal || request.final) ?? false,
      });
    });
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "600px" }}>
      {hydratedResults.map((resultData) => (
        <Result
          key={resultData.resultConfig.resultConfigId}
          {...resultData}
          displayDescripton={true}
        />
      ))}
    </Box>
  );
};
