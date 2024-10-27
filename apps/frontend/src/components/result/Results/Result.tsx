import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { Box, Typography } from "@mui/material";

import { AnswerFreeInput } from "@/components/Field/AnswerFreeInput";
import { FieldOptions } from "@/components/Field/FieldOptions";
import { statusProps } from "@/components/status/statusProps";
import {
  FieldFragment,
  FieldType,
  ResultConfigFragment,
  ResultGroupFragment,
  Status,
} from "@/graphql/generated/graphql";

import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";
import { createResultConfigDescription } from "../createResultConfigDescription";
import { ResultHeader } from "../ResultName";

export const Result = ({
  field,
  resultConfig,
  resultGroup,
  requestStepStatus,
  displayDescripton,
  onlyShowSelections = false,
  displayFieldOptionsIfNoResult = true,
}: {
  field: FieldFragment;
  resultConfig: ResultConfigFragment;
  resultGroup: ResultGroupFragment | null;
  requestStepStatus: Status;
  onlyShowSelections?: boolean;
  displayDescripton: boolean;
  displayFieldOptionsIfNoResult?: boolean;
}) => {
  console.log("result group");
  console.log("field", field);
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
        <ResultHeader label={resultConfig.name} requestStatus={requestStepStatus} />
        <Typography color="primary" fontSize="1rem">
          {field?.name}
        </Typography>
        {displayDescripton && (
          <Typography variant="description" sx={{ whiteSpace: "pre-line" }}>
            {createResultConfigDescription(resultConfig)}
          </Typography>
        )}
        {resultGroup && !resultGroup?.hasResult && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
            <DoNotDisturbIcon color="warning" fontSize="small" />
            <Typography variant="description" color={(theme) => theme.palette.warning.main}>
              This collaborative step finished without a final{" "}
              {resultConfig.__typename === "Decision" ? "decision" : "result"}.
            </Typography>
          </Box>
        )}
        {resultGroup &&
          resultGroup.results.map((result, index) => {
            return (
              <Box key={"result" + index}>
                {index > 0 && <Typography variant="description">{result.name}</Typography>}
                {field &&
                  field.__typename === FieldType.Options &&
                  result.resultItems.some((item) => item.optionId) &&
                  (resultGroup || (!resultGroup && displayFieldOptionsIfNoResult)) && (
                    <FieldOptions
                      // key={"options" + index}
                      fieldOptions={field}
                      final={!!result}
                      optionSelections={result.resultItems}
                      onlyShowSelections={onlyShowSelections}
                    />
                  )}
                {field &&
                  // field.__typename === FieldType.FreeInput &&
                  result.resultItems.some((item) => !item.optionId) &&
                  result.resultItems.map((item) => (
                    <AnswerFreeInput answer={item.value} dataType={item.dataType} key={item.id} />
                  ))}
              </Box>
            );
          })}
        {(!resultGroup || !resultGroup.hasResult) &&
          field &&
          field.__typename === FieldType.Options &&
          displayFieldOptionsIfNoResult && (
            <FieldOptions
              fieldOptions={field}
              final={!!resultGroup}
              onlyShowSelections={onlyShowSelections}
            />
          )}
      </Box>
    </LabeledGroupedInputs>
  );
};
