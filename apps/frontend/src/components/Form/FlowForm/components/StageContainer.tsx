import { WarningOutlined } from "@mui/icons-material";
import { Box, Paper, SxProps, Typography } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import { colors } from "@/style/style";

interface StageContainerProps {
  label: string;
  id: string;
  children?: React.ReactNode;
  sx?: SxProps;
  hasError?: boolean;
  icon?: any;
  setSelectedId: Dispatch<SetStateAction<string | false>>;
  selectedId: string | false;
}

export const StageContainer = ({
  label,
  id,
  children,
  setSelectedId,
  selectedId,
  hasError = false,
  icon,
  sx = {},
}: StageContainerProps) => {
  const isSelected = selectedId === id;
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Paper
        elevation={1}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          marginLeft: hasError ? "28px" : "0px",
          border: "1px solid",
          borderWidth: isSelected ? "2px" : "1px",

          borderColor: hasError ? colors.error : isSelected ? colors.primary : "rgba(0, 0, 0, 0.1)",
          width: "240px",
          padding: "8px",
          "&&:hover": {
            // backgroundColor: "#B69DF8",
            boxShadow: `0px 0px 0px 2px ${colors.primaryContainer} inset`,
          },
          ...sx,
        }}
      >
        {icon}
        <Box sx={{ marginRight: "12px", display: "flex" }}></Box>
        <Box
          onClick={() => {
            setSelectedId(id);
          }}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
          }}
        >
          <Typography color="primary">{label}</Typography>
          {children}
        </Box>
      </Paper>
      {hasError && <WarningOutlined color={"error"} fontSize="small" sx={{ marginLeft: "8px" }} />}
    </Box>
  );
};
