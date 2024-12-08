import { Box } from "@mui/material";

export const InfoBannersContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={(theme) => ({
        [theme.breakpoints.down("sm")]: {
          flexDirection: "column",
          gap: "0px",
        },
        display: "flex",
        gap: "24px",
        // marginBottom: "36px",
      })}
    >
      {children}
    </Box>
  );
};
