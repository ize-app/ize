import { Box, Typography } from "@mui/material";

export const ResultFormSection = ({ label, children }: { label: string; children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        padding: "12px",
        width: "100%",
      }}
    >
      <Typography variant={"label"} color="primary">
        {label}
      </Typography>
      {children}
    </Box>
  );
};
