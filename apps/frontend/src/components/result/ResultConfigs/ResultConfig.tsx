import { Box } from "@mui/material";

import { FieldOptions } from "@/components/Field/FieldOptions";
import { FieldFragment, FieldType, ResultConfigFragment } from "@/graphql/generated/graphql";

import { createResultConfigDescription } from "../createResultConfigDescription";
import { getResultLabel } from "../getResultLabel";
import { ResultHeader } from "../ResultName";

export const ResultConfig = ({
  resultConfig,
  field,
}: {
  resultConfig: ResultConfigFragment;
  field: FieldFragment | null;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <ResultHeader
        name={field?.name}
        label={getResultLabel({ type: "resultConfig", result: resultConfig })}
      />
      {createResultConfigDescription(resultConfig)}
      {field && field.__typename === FieldType.Options && (
        <FieldOptions fieldOptions={field} final={false} />
      )}
    </Box>
  );
};
