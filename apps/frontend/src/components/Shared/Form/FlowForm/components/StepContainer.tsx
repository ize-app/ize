import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

export const StepContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Paper sx={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: "20px" }}>
      {children}
    </Paper>
  );
};

export const StepComponentContainer = ({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {label && (
        <Typography color="primary" fontWeight={"500"} marginBottom="16px" fontSize="1rem">
          {label}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>{children}</Box>
    </Box>
  );
};
