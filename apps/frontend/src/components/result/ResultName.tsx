import { Box, Chip } from "@mui/material";

import { Status } from "@/graphql/generated/graphql";

import { StatusTag } from "../status/StatusTag";

export const ResultHeader = ({
  label,
  requestStatus,
}: {
  label: string;
  requestStatus?: Status;
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Chip label={label} size="small" />
      {requestStatus && <StatusTag status={requestStatus} />}
    </Box>
  );
}