import { SxProps } from "@mui/material";
import Box from "@mui/material/Box";

import logoRepeatUrl from "@/assets/ize-repeat.svg";

export const IzeLogoBackground = ({
  children,
  sx = {},
}: {
  children: React.ReactNode;
  sx?: SxProps;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage: `url(${logoRepeatUrl})`,
        backgroundSize: "300px",
        ...sx,
      }}
    >
      {children}
    </Box>
  );
};
