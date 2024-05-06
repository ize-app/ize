import { Box, Paper, SvgIcon, SvgIconProps, SxProps } from "@mui/material";
import { Dispatch, SetStateAction } from "react";
import muiTheme from "@/style/muiTheme";
import { colors } from "@/style/style";

export interface StageProps {
  id: string;
  children?: React.ReactNode;
  sx?: SxProps;
  icon?: React.ComponentType<SvgIconProps>;
  color?: string;
  statusIcon?: any;
  setSelectedId: Dispatch<SetStateAction<string | false>>;
  selectedId: string | false;
}

export const Stage = ({
  id,
  children,
  setSelectedId,
  selectedId,
  statusIcon,
  icon,
  color,
  sx = {},
}: StageProps) => {
  const isSelected = selectedId === id;
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        marginLeft: "36px",
      }}
    >
      <Paper
        elevation={1}
        onClick={() => {
          setSelectedId(id);
        }}
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "48px",
          border: "1px solid",
          borderWidth: isSelected ? "4px" : "1px",
          borderColor: isSelected ? muiTheme.palette.primary.main : "rgba(0, 0, 0, 0.1)",
          width: "240px",
          padding: "8px",
          "&&:hover": {
            boxShadow: `0px 0px 0px 2px ${muiTheme.palette.primary.light} inset`,
          },
          ...sx,
        }}
      >
        {icon ? (
          <Box sx={{ marginRight: "12px", display: "flex" }}>
            <SvgIcon component={icon} style={{ color: color ?? colors.primary }} />
          </Box>
        ) : null}
        {children}
      </Paper>
      <Box
        sx={{
          width: "36px",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {statusIcon}
      </Box>
    </Box>
  );
};
