import { Box, Chip } from "@mui/material";

import { Status } from "@/graphql/generated/graphql";

import { StatusTag } from "../status/StatusTag";

export const ResultHeader = ({
  label,
  requestStatus,
}: {
  name: string | undefined;
  label: string;
  requestStatus?: Status;
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", gap: "8px" }}>
        <Chip label={label} size="small" />{" "}
      </Box>
      {requestStatus && (
        <StatusTag status={requestStatus} />
        // <Chip
        //   label={statusProps[requestStatus].label}
        //   sx={{
        //     backgroundColor: statusProps[requestStatus].backgroundColor,
        //     color: statusProps[requestStatus].color,
        //   }}
        //   size="small"
        // />
      )}
    </Box>
  );
};
