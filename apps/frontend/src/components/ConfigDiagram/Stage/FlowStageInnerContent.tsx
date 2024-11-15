import { Box, Typography } from "@mui/material";

import { StageType } from "./StageType";

export const FlowFormStageInnerContent = ({
  type,
  label,
  subtitle,
  color,
}: {
  type: StageType;
  label: string;
  subtitle: string;
  color: string;
}) => {
  return type === StageType.ActionFilter ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        maxWidth: "200px",
        overflow: "hidden",
      }}
    >
      <Typography
        variant="description"
        lineHeight={"1rem"}
        width={"100%"}
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        <span style={{ fontStyle: "italic" }}>Decision filter:</span> {label}
      </Typography>
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
      }}
    >
      <Typography variant="label" color={color}>
        {label}
      </Typography>
      {subtitle && (
        <Typography fontSize={".7rem"} lineHeight={"1rem"} width={"100%"}>
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};
