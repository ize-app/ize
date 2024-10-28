import { AccessAlarm } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

import { intervalToIntuitiveTimeString } from "@/utils/inputs";

// takes milleseconds left and returns a string representation of the time left
export const TimeLeft = ({ msLeft }: { msLeft: number }) => {
  const displayRed = msLeft < 1000 * 60 * 60 * 24;
  const timeLeftStr = intervalToIntuitiveTimeString(msLeft);
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
      <AccessAlarm fontSize="small" color={displayRed ? "error" : "primary"} />
      <Typography
        color={displayRed ? "error" : "inherit"}
        textAlign="right"
        sx={{ display: "block" }}
      >
        {timeLeftStr} left to respond
      </Typography>
    </Box>
  );
};
