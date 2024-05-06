import { Box, Chip, Typography } from "@mui/material";

import { ResultType } from "@/graphql/generated/graphql";

export const ResultName = ({
  name,
  resultType,
}: {
  name: string | undefined;
  resultType: ResultType;
}) => {
  return (
    <Box sx={{ display: "flex", gap: "8px" }}>
      <Chip label={resultType} size="small" /> <Typography variant="label">{name}</Typography>
    </Box>
  );
};
