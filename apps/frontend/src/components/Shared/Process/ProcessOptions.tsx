import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";

export const ProcessOptions = ({ options }: { options: string[] }) => (
  <Box sx={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
    {options.map((option, index) => (
      <Chip
        label={option}
        key={option + index.toString()}
        sx={{ minWidth: "50px" }}
      />
    ))}
  </Box>
);
