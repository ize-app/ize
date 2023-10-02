import Box from "@mui/material/Box";

interface WizardBodyProps {
  children: React.ReactNode;
}

export const WizardBody = ({ children }: WizardBodyProps) => (
  <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
    {children}
  </Box>
);
