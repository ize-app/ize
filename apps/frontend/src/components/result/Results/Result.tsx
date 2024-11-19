import { Box, SvgIcon, Typography } from "@mui/material";

import { AnswerFreeInput } from "@/components/Field/AnswerFreeInput";
import { FieldOptions } from "@/components/Field/FieldOptions";
import { resultGroupStatusProps } from "@/components/status/resultGroupStatusProps";
import {
  FieldFragment,
  FieldType,
  ResultConfigFragment,
  ResultGroupFragment,
  ResultGroupStatus,
} from "@/graphql/generated/graphql";

import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";
import { createResultConfigDescription } from "../createResultConfigDescription";
import { ResultHeader } from "../ResultName";

export const Result = ({
  field,
  resultConfig,
  resultGroup,
  displayDescripton,
  minResponses,
  onlyShowSelections = false,
  displayFieldOptionsIfNoResult = true,
}: {
  field: FieldFragment;
  resultConfig: ResultConfigFragment;
  resultGroup: ResultGroupFragment | null;
  minResponses: number | undefined | null;
  onlyShowSelections?: boolean;
  displayDescripton: boolean;
  displayFieldOptionsIfNoResult?: boolean;
}) => {
  const statusProps = resultGroupStatusProps[resultGroup?.status ?? ResultGroupStatus.NotStarted];

  const backgroundColor = statusProps.lightColor ?? "white";
  const icon = statusProps.icon ? (
    <Box sx={{ marginRight: "12px", display: "flex" }}>
      <SvgIcon component={statusProps.icon} style={{ color: statusProps.color }} />
    </Box>
  ) : null;
  return (
    <LabeledGroupedInputs
      sx={{
        padding: "12px 16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        borderColor: statusProps.color,
        backgroundColor,
      }}
      key={resultConfig.resultConfigId}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <ResultHeader
          label={resultConfig.name}
          resultGroupStatus={resultGroup?.status ?? ResultGroupStatus.NotStarted}
        />
        <Typography color="primary" fontSize="1rem">
          {field?.name}
        </Typography>
        {displayDescripton && (
          <Typography variant="description" sx={{ whiteSpace: "pre-line" }}>
            {createResultConfigDescription({ resultConfig, minResponses })}
          </Typography>
        )}
        {resultGroup?.status === ResultGroupStatus.Error && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
            {icon}
            <Typography variant="description" color={(theme) => theme.palette.warning.main}>
              Error creating final {resultConfig.__typename === "Decision" ? "decision" : "result"}.
            </Typography>
          </Box>
        )}
        {resultGroup?.status === ResultGroupStatus.Attempting && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
            {icon}
            <Typography variant="description" color={(theme) => theme.palette.warning.main}>
              Creating results
              {resultConfig.__typename === "Decision" ? "decision" : "result"}.
            </Typography>
          </Box>
        )}
        {resultGroup?.status === ResultGroupStatus.FinalNoResult && (
          <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
            {icon}
            <Typography variant="description" color={(theme) => theme.palette.warning.main}>
              This collaborative step finished without a final{" "}
              {resultConfig.__typename === "Decision" ? "decision" : "result"}.
            </Typography>
          </Box>
        )}
        {resultGroup?.status === ResultGroupStatus.FinalResult &&
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
        {(!resultGroup || resultGroup.status === ResultGroupStatus.NotStarted) &&
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
