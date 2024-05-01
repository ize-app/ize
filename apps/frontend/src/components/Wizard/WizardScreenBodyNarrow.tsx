import Box from "@mui/material/Box";

interface WizardScreenBodyNarrowProps {
  children: React.ReactNode;
}

export const WizardScreenBodyNarrow = ({ children }: WizardScreenBodyNarrowProps) => (
  <Box
    sx={(theme) => ({
      display: "flex",
      flexDirection: "column",
      width: "100%",
      [theme.breakpoints.up("sm")]: {
        paddingLeft: "48px",
        paddingRight: "48px",
      },
      maxWidth: "1000px",
    })}
  >
    {children}
  </Box>
);
