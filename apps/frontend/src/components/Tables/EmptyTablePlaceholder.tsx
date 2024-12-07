import { Box } from "@mui/material";

import { IzeLogoBackground } from "@/layout/IzeLogoBackground";

export const EmptyTablePlaceholder = ({ children }: { children: React.ReactNode }) => (
  <IzeLogoBackground
    sx={{
      maxHeight: "900px",
      minWidth: "400px",
      backgroundColor: "hsla(0, 100%, 100%, 0.5)",
      padding: "60px",
      marginTop: "20px",
    }}
  >
    <Box
      sx={{
        width: "100%",
        backgroundColor: "hsla(0, 100%, 100%, 0.9)",
        display: "flex",
        maxWidth: "600px",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px",
      }}
    >
      {children}
    </Box>
  </IzeLogoBackground>
);
