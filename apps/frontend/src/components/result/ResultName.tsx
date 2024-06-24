import { Box, Chip, Typography } from "@mui/material";

import { statusProps } from "@/components/status/statusProps";
import { ResultType, Status } from "@/graphql/generated/graphql";

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
        <Typography color="primary" fontSize=".875rem">
          {name}
        </Typography>
      </Box>
      {requestStatus && (
        <Chip
          label={statusProps[requestStatus].label}
          sx={{
            backgroundColor: statusProps[requestStatus].backgroundColor,
            color: statusProps[requestStatus].color,
          }}
          size="small"
        />
      )}
    </Box>
  );
};
