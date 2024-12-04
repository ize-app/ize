import { Box, Typography } from "@mui/material";

import { FieldOptions } from "@/components/Field/FieldOptions";
import { resultGroupStatusProps } from "@/components/status/resultGroupStatusProps";
import { Value } from "@/components/Value/Value";
import {
  FieldFragment,
  OptionFragment,
  ResponseFieldAnswersSummaryFragment,
  ResultConfigFragment,
  ResultGroupFragment,
  ResultGroupStatus,
  ResultType,
  ValueType,
} from "@/graphql/generated/graphql";

import { LabeledGroupedInputs } from "../../Form/formLayout/LabeledGroupedInputs";
import { createResultConfigDescription } from "../createResultConfigDescription";
import { ResultHeader } from "../ResultName";
import { ResultGroupStatusDisplay } from "./ResultGroupStatus";

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
  triggerDefinedOptions,
  finalField,
}: {
  field: FieldFragment;
  resultConfig: ResultConfigFragment;
  resultGroup: ResultGroupFragment | null;
  responseSummary: ResponseFieldAnswersSummaryFragment | null;
  minResponses: number | undefined | null;
  displayDescripton: boolean;
  triggerDefinedOptions?: OptionFragment[];
  finalField: boolean;
}) => {
  const statusProps = resultGroupStatusProps[resultGroup?.status ?? ResultGroupStatus.NotStarted];
  const backgroundColor = statusProps.lightColor ?? "white";

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
        <ResultGroupStatusDisplay
          status={resultGroup?.status}
          resultType={resultConfig.__typename as ResultType}
        />
        {resultGroup &&
          resultGroup.results.map((result) => {
            return result.type !== ResultType.LlmSummary &&
              field.type === ValueType.OptionSelections ? (
              <LabeledGroupedInputs
                key={result.id}
                sx={{ backgroundColor: "white" }}
                label={getResultGroupLabel({ status: resultGroup.status, name: result.name })}
              >
                <FieldOptions
                  field={field}
                  finalOptions={true}
                  responseSummary={responseSummary}
                  optionSelections={result.resultItems}
                  onlyShowSelections={false}
                />
              </LabeledGroupedInputs>
            ) : (
              <LabeledGroupedInputs
                key={result.id}
                sx={{ backgroundColor: "white", padding: "8px" }}
                label={getResultGroupLabel({ status: resultGroup.status, name: result.name })}
              >
                {result.resultItems.map((item) => (
                  <Value key={item.id} value={item.value} field={field} type={"fieldAnswer"} />
                ))}
              </LabeledGroupedInputs>
            );
          })}
        {!resultGroup && field.type === ValueType.OptionSelections && (
          <LabeledGroupedInputs sx={{ backgroundColor: "white" }} label={"Options"}>
            <FieldOptions
              field={field}
              finalOptions={finalField}
              responseSummary={responseSummary}
              onlyShowSelections={false}
              triggerDefinedOptions={triggerDefinedOptions}
            />
          </LabeledGroupedInputs>
        )}
      </Box>
    </LabeledGroupedInputs>
  );
};
