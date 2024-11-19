import { Chip } from "@mui/material";

import { StatusProps } from "./statusProps";

export const StatusTag = ({ statusProps }: { statusProps: StatusProps }) => {
  return (
    <Chip
      label={statusProps.label}
      sx={{
        borderRadius: "1px",
        backgroundColor: "white",
        border: `1px solid ${statusProps.color}`,
        color: statusProps.color,
      }}
      size="small"
    />
  );
};
