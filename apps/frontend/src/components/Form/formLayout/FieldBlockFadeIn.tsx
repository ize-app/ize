import { Box, Fade, SxProps } from "@mui/material";

export const FieldBlockFadeIn = ({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: SxProps;
}) => {
  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px", ...sx }}>{children}</Box>
    </Fade>
  );
};
