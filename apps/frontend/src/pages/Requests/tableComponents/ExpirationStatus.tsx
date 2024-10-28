import HourglassTopIcon from "@mui/icons-material/HourglassTop";
import { useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { intervalToIntuitiveTimeString } from "@/utils/inputs";

export const ExpirationStatus = ({ expirationDate }: { expirationDate: Date }) => {
  const now = new Date();
  const theme = useTheme();

  if (expirationDate < now) return "";

  const timeLeft = expirationDate.getTime() - now.getTime();
  const timeLeftStr = intervalToIntuitiveTimeString(Math.max(timeLeft, 0));

  const lessThanOneDayLeft = timeLeft < 86400000 * 2;

  const color = theme.palette.warning.main;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "6px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HourglassTopIcon sx={{ fontSize: "16px", color }} />
      <Typography
        sx={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: "1",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        color={color}
        variant="description"
        align="center"
      >
        {timeLeftStr}
      </Typography>
    </Box>
  );

  return lessThanOneDayLeft ? (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: "6px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <HourglassTopIcon color="warning" sx={{ fontSize: "16px" }} />
      <Typography
        sx={(theme) => ({
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: "1",
          overflow: "hidden",
          textOverflow: "ellipsis",
          color: theme.palette.warning.main,
        })}
        color={"error"}
        align="center"
      >
        {timeLeftStr}
      </Typography>
    </Box>
  ) : (
    <Typography
      sx={{
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: "1",
        overflow: "hidden",
        textOverflow: "ellipsis",
      }}
      align="center"
    >
      {expirationDate.toLocaleDateString("en-US", { dateStyle: "short" })}
    </Typography>
  );
};
