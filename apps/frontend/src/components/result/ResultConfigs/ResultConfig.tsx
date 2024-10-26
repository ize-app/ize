import { Box, Typography } from "@mui/material";

import { FieldOptions } from "@/components/Field/FieldOptions";
import { FieldType, ResultConfigFragment } from "@/graphql/generated/graphql";

import { createResultConfigDescription } from "../createResultConfigDescription";
import { ResultHeader } from "../ResultName";

export const ResultConfig = ({ resultConfig }: { resultConfig: ResultConfigFragment }) => {
  const { field } = resultConfig;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <ResultHeader label={resultConfig.name} />
      <Typography color="primary">{field?.name}</Typography>
      {createResultConfigDescription(resultConfig)}
      {field && field.__typename === FieldType.Options && (
        <FieldOptions fieldOptions={field} final={false} />
      )}
    </Box>
  );
};
