import { Box, SvgIcon, Typography } from "@mui/material";

import { AnswerFreeInput } from "@/components/Field/AnswerFreeInput";
import { FieldOptions } from "@/components/Field/FieldOptions";
import { resultGroupStatusProps } from "@/components/status/resultGroupStatusProps";
import {
  FieldFragment,
  FieldType,
  ResponseFieldAnswersSummaryFragment,
  ResultConfigFragment,
  ResultGroupFragment,
  ResultGroupStatus,
  ResultType,
} from "@/graphql/generated/graphql";

import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";
import { createResultConfigDescription } from "../createResultConfigDescription";
import { ResultHeader } from "../ResultName";

const getResultGroupLabel = ({ name, status }: { name: string; status: ResultGroupStatus }) => {
  if ([ResultGroupStatus.FinalResult].includes(status)) return name;
  else if ([ResultGroupStatus.FinalNoResult, ResultGroupStatus.Error].includes(status))
    return `No result: ${name}`;
  else if (
    [
      ResultGroupStatus.Attempting,
      ResultGroupStatus.NotStarted,
      ResultGroupStatus.Preliminary,
    ].includes(status)
  )
    return `Pending: ${name}`;
  else return name;
};

export const Result = ({
  field,
  resultConfig,
  resultGroup,
  displayDescripton,
  minResponses,
  responseSummary,
}: {
  field: FieldFragment;
  resultConfig: ResultConfigFragment;
  resultGroup: ResultGroupFragment | null;
  responseSummary: ResponseFieldAnswersSummaryFragment | null;
  minResponses: number | undefined | null;
  displayDescripton: boolean;
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

        {resultGroup &&
          resultGroup.results.map((result) => {
            return result.type !== ResultType.LlmSummary &&
              field.__typename === FieldType.Options ? (
              <LabeledGroupedInputs
                sx={{ backgroundColor: "white" }}
                label={getResultGroupLabel({ status: resultGroup.status, name: result.name })}
              >
                <FieldOptions
                  fieldOptions={field}
                  final={!!resultGroup}
                  responseSummary={responseSummary}
                  optionSelections={result.resultItems}
                  onlyShowSelections={false}
                />
              </LabeledGroupedInputs>
            ) : (
              result.resultItems.map((item) => (
                <LabeledGroupedInputs
                  key={item.id}
                  sx={{ backgroundColor: "white" }}
                  label={getResultGroupLabel({ status: resultGroup.status, name: result.name })}
                >
                  <AnswerFreeInput answer={item.value} dataType={item.dataType} />
                </LabeledGroupedInputs>
              ))
            );
          })}
        {!resultGroup && field.__typename === FieldType.Options && (
          <FieldOptions
            fieldOptions={field}
            final={!!resultGroup}
            responseSummary={responseSummary}
            onlyShowSelections={false}
          />
        )}
      </Box>
    </LabeledGroupedInputs>
  );
};
