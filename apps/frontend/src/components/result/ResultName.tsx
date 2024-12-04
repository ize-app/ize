import { Box, Chip } from "@mui/material";

import { ResultGroupStatus } from "@/graphql/generated/graphql";

import { resultGroupStatusProps } from "../status/resultGroupStatusProps";
import { StatusTag } from "../status/StatusTag";

export const ResultHeader = ({
  label,
  resultGroupStatus,
}: {
  label: string;
  resultGroupStatus?: ResultGroupStatus | undefined;
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Chip label={label} size="small" />
      {resultGroupStatus && <StatusTag statusProps={resultGroupStatusProps[resultGroupStatus]} />}
    </Box>
  );
};
