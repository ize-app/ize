import Box from "@mui/material/Box";

interface WizardScreenBodyProps {
  children: React.ReactNode;
}

export const WizardScreenBody = ({ children }: WizardScreenBodyProps) => (
  <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>{children}</Box>
);
