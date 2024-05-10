import {
  FieldFragment,
  FieldType,
  ResultConfigFragment,
  ResultType,
} from "@/graphql/generated/graphql";
import { Box, Typography } from "@mui/material";
import { FieldOptions } from "@/components/Field/FieldOptions";
import { createResultConfigDescription } from "../createResultConfigDescription";
import { resultTypeDisplay } from "../resultTypeDisplay";
import { ResultName } from "../ResultName";

export const ResultConfig = ({
  resultConfig,
  field,
}: {
  resultConfig: ResultConfigFragment;
  field: FieldFragment | null;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <ResultName
        name={field?.name}
        resultType={resultTypeDisplay[resultConfig.__typename] as ResultType}
      />
      <Typography variant="description">{createResultConfigDescription(resultConfig)}</Typography>
      {field && field.__typename === FieldType.Options && (
        <FieldOptions fieldOptions={field} final={false} />
      )}
    </Box>
  );
};
