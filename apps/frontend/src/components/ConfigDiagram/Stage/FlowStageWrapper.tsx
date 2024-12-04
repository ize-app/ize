import { Box } from "@mui/material";

import { StageType } from "./StageType";

export const FlowStageWrapper = ({
  type,
  children,
}: {
  type: StageType;
  children: React.ReactNode;
}) => {
  return type !== StageType.ActionFilter ? (
    <>{children}</>
  ) : (
    <Box sx={{ height: "48px", position: "relative", display: "flex", alignItems: "flex-end" }}>
      <Box
        sx={(theme) => ({
          position: "absolute",
          height: "20px",
          width: "2px",
          backgroundColor: theme.palette.grey[400],
          left: "50%",
          transform: "translateX(-50%)",
          top: 0,
        })}
      />
      {children}
    </Box>
  );
};
