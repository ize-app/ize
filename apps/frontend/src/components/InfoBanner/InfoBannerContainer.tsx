import InfoIcon from "@mui/icons-material/Info";
import { Box, Typography } from "@mui/material";

export const InfoBannerContainer = ({
  children,
  title,
  showInfoIcon,
}: {
  children: React.ReactNode;
  title: string;
  showInfoIcon: boolean;
}) => {
  return (
    <Box
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        maxWidth: "600px",
        gap: "16px",

        outline: `1px solid ${theme.palette.grey[200]}`,
        padding: "12px",
      })}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", gap: "6px" }}>
        {showInfoIcon && <InfoIcon color="info" fontSize="small" />}
        <Typography variant="description">{title}</Typography>
      </Box>
      {children}
    </Box>
  );
};
