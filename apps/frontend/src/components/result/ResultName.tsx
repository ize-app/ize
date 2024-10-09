import { Box, Chip, Typography } from "@mui/material";

import { ResultType, Status } from "@/graphql/generated/graphql";

import { StatusTag } from "../status/StatusTag";

export const ResultHeader = ({
  name,
  resultType,
  requestStatus,
}: {
  name: string | undefined;
  resultType: ResultType;
  requestStatus?: Status;
}) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", gap: "8px" }}>
        <Chip label={resultType} size="small" />{" "}
        <Typography color="primary" fontSize="1rem">
          {name}
        </Typography>
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
