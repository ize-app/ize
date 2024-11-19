import { Box, Paper, SvgIcon, SvgIconProps, SxProps, useMediaQuery, useTheme } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

import muiTheme from "@/style/muiTheme";
import { colors } from "@/style/style";

export interface StagePropsBase {
  id: string;
  setSelectedId: Dispatch<SetStateAction<string | false>>;
  selectedId: string | false;
  children?: React.ReactNode;
}

export interface StageProps extends StagePropsBase {
  sx?: SxProps;
  icon?: React.ComponentType<SvgIconProps>;
  color?: string;
  statusIcon?: React.ComponentType<SvgIconProps> | null | undefined;
  size?: "small" | "medium";
}

export const Stage = ({
  id,
  children,
  setSelectedId,
  selectedId,
  statusIcon,
  icon,
  color,
  size = "medium",
  sx = {},
}: StageProps) => {
  const isSelected = selectedId === id;
  const theme = useTheme();
  const isSmallScreenSize = useMediaQuery(theme.breakpoints.up("sm"));
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: "36px",
        width: "310px",
      }}
    >
      <Paper
        elevation={1}
        onClick={() => {
          setSelectedId(id);
        }}
        sx={{
          display: "flex",
          width: "100%",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-start",
          minHeight: "48px",
          border: "1px solid",
          borderWidth: isSelected ? "4px" : "1px",
          borderColor: isSelected ? color ?? muiTheme.palette.primary.main : "rgba(0, 0, 0, 0.1)",

          padding: "8px",
          "&&:hover": {
            boxShadow: `0px 0px 0px 2px ${muiTheme.palette.primary.light} inset`,
          },
          ...sx,
        }}
      >
        {icon && isSmallScreenSize ? (
          <Box sx={{ marginRight: "12px", display: "flex" }}>
            <SvgIcon component={icon} fontSize={size} style={{ color: color ?? colors.primary }} />
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
        {statusIcon && isSmallScreenSize ? (
          <SvgIcon
            fontSize={size}
            component={statusIcon}
            style={{ color: color ?? colors.primary }}
          />
        ) : null}
      </Box>
    </Box>
  );
};
