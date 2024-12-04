import { ArrowDownward } from "@mui/icons-material";
import { Box } from "@mui/material";

export const StageConnectorButton = () => {
  return (
    <Box sx={{ width: "100%", display: "flex", justifyContent: "center", margin: "6px 0px" }}>
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ArrowDownward fontSize="small" color="secondary" sx={{ color: "#C0C0C0" }} />
      </Box>
    </Box>
  );
};
