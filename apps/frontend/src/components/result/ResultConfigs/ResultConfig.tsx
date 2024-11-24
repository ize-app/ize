import { Box, Typography } from "@mui/material";

import { FieldOptions } from "@/components/Field/FieldOptions";
import { LabeledGroupedInputs } from "@/components/Form/formLayout/LabeledGroupedInputs";
import { FieldType, ResultConfigFragment } from "@/graphql/generated/graphql";

import { createResultConfigDescription } from "../createResultConfigDescription";
import { ResultHeader } from "../ResultName";

export const ResultConfig = ({
  resultConfig,
  minResponses,
}: {
  resultConfig: ResultConfigFragment;
  minResponses: number | undefined | null;
}) => {
  const { field } = resultConfig;
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      <ResultHeader label={resultConfig.name} />
      <Typography color="primary">{field?.name}</Typography>
      {createResultConfigDescription({ resultConfig, minResponses })}
      {field && field.__typename === FieldType.Options && (
        <LabeledGroupedInputs label="Options" sx={{ backgroundColor: "white" }}>
          <FieldOptions fieldOptions={field} finalOptions={false} />
        </LabeledGroupedInputs>
      )}
    </Box>
  );
};
