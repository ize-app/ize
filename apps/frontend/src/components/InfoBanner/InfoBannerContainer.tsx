import InfoIcon from "@mui/icons-material/Info";
import { Box, Typography } from "@mui/material";

export const InfoBannerContainer = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) => {
  return (
    <Box
      // elevation={2}
      sx={(theme) => ({
        outline: `1px solid ${theme.palette.info.main}`,
        minWidth: "300px",
        backgroundColor: "white",
        padding: "12px",
        width: "fit-content",
        maxWidth: "900px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        marginBottom: "30px",
      })}
    >
      <Box sx={{ marginBottom: "12px", display: "flex", alignItems: "flex-start", gap: "6px" }}>
        <InfoIcon color="info" fontSize="small" />
        <Typography variant="label" color="info">
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};
