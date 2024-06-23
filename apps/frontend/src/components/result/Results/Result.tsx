import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { Box, Typography } from "@mui/material";

import { AnswerFreeInput } from "@/components/Field/AnswerFreeInput";
import { FieldOptions } from "@/components/Field/FieldOptions";
import { UserFieldAnswers } from "@/components/Field/UserFieldAnswers";
import { statusProps } from "@/components/status/statusProps";
import {
  FieldFragment,
  FieldType,
  ResultConfigFragment,
  ResultFragment,
  ResultType,
  Status,
  UserFieldAnswersFragment,
} from "@/graphql/generated/graphql";

import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";
import { createResultConfigDescription } from "../createResultConfigDescription";
import { ResultHeader } from "../ResultName";
import { resultTypeDisplay } from "../resultTypeDisplay";

export const Result = ({
  resultConfig,
  field,
  result,
  requestStepStatus,
  fieldAnswers,
  displayDescripton,
  onlyShowSelections = false,
  displayFieldOptionsIfNoResult = true,
}: {
  resultConfig: ResultConfigFragment;
  field: FieldFragment | null;
  result: ResultFragment | null;
  requestStepStatus: Status;
  fieldAnswers?: UserFieldAnswersFragment | undefined;
  onlyShowSelections?: boolean;
  displayDescripton: boolean;
  displayFieldOptionsIfNoResult?: boolean;
}) => {
  console.log("result is ", result);
  return (
    <LabeledGroupedInputs
      sx={{
        padding: "12px 16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        borderColor: statusProps[requestStepStatus].backgroundColor,
        backgroundColor:
          requestStepStatus === Status.Completed
            ? "#f5faf5"
            : requestStepStatus === Status.InProgress
              ? "#f3f8fb"
              : "white",
      }}
      key={resultConfig.resultConfigId}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ResultHeader
          name={field?.name}
          resultType={resultTypeDisplay[resultConfig.__typename] as ResultType}
          requestStatus={requestStepStatus}
        />
        {displayDescripton && (
          <Typography variant="description">
            {createResultConfigDescription(resultConfig)}
          </Typography>
        )}
        {result && !result?.hasResult && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
            <DoNotDisturbIcon color="warning" fontSize="small" />
            <Typography variant="description" color={(theme) => theme.palette.warning.main}>
              This collaborative step finished without a final{" "}
              {resultConfig.__typename === "Decision" ? "decision" : "result"}.
            </Typography>
          </Box>
        )}
        {field &&
          field.__typename === FieldType.Options &&
          (result || (!result && displayFieldOptionsIfNoResult)) && (
            <FieldOptions
              fieldOptions={field}
              final={!!result}
              optionSelections={result?.resultItems}
              onlyShowSelections={onlyShowSelections}
            />
          )}
        {field &&
          field.__typename === FieldType.FreeInput &&
          result?.resultItems.map((item) => (
            <AnswerFreeInput answer={item.value} dataType={item.dataType} key={item.id} />
          ))}
      </Box>
      {fieldAnswers && field && (
        <UserFieldAnswers userFieldAnswers={fieldAnswers} field={field} key={result?.id} />
      )}
    </LabeledGroupedInputs>
  );
};
