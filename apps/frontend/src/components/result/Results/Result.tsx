import DoNotDisturbIcon from "@mui/icons-material/DoNotDisturb";
import { Box, Typography } from "@mui/material";

import { AnswerFreeInput } from "@/components/Field/AnswerFreeInput";
import { FieldOptions } from "@/components/Field/FieldOptions";
import {
  FieldFragment,
  FieldType,
  ResultConfigFragment,
  ResultFragment,
  ResultType,
} from "@/graphql/generated/graphql";

import { createResultConfigDescription } from "../createResultConfigDescription";
import { ResultName } from "../ResultName";
import { resultTypeDisplay } from "../resultTypeDisplay";

export const Result = ({
  resultConfig,
  field,
  result,
}: {
  resultConfig: ResultConfigFragment;
  field: FieldFragment | null;
  result: ResultFragment | null;
}) => {
  console.log("result is ", result);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <ResultName
        name={field?.name}
        resultType={resultTypeDisplay[resultConfig.__typename] as ResultType}
      />
      <Typography variant="description">{createResultConfigDescription(resultConfig)}</Typography>
      {result && !result?.hasResult && (
        <Box sx={{ display: "flex", flexDirection: "row", gap: "8px", alignItems: "center" }}>
          <DoNotDisturbIcon color="warning" fontSize="small" />
          <Typography variant="description" color={(theme) => theme.palette.warning.main}>
            This collaborative step finished without a final{" "}
            {resultConfig.__typename === "Decision" ? "decision" : "result"}.
          </Typography>
        </Box>
      )}
      {field && field.__typename === FieldType.Options && (
        <FieldOptions
          fieldOptions={field}
          final={!!result}
          optionSelections={result?.resultItems}
        />
      )}
      {field &&
        field.__typename === FieldType.FreeInput &&
        result?.resultItems.map((item) => (
          <AnswerFreeInput answer={item.value} dataType={item.dataType} key={item.id} />
        ))}
    </Box>
  );
};
