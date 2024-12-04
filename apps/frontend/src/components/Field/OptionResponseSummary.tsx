import { Box } from "@mui/material";

interface OptionResponseSummaryProps {
  percentage: number;
}

export const OptionResponseSummary: React.FC<OptionResponseSummaryProps> = ({ percentage }) => {
  return (
    <Box
      sx={{
        width: "100%",
        borderTop: "1px solid #ccc",
        borderBottom: "1px solid #ccc",
        // borderRadius: "8px",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        position: "relative",
        // mb: 2,
        // margin: "0px 4px 0px 4px",
        height: "8px",
      }}
    >
      {/* Shaded part */}
      <Box
        sx={(theme) => ({
          width: `${percentage}%`,
          height: "100%",
          //   backgroundColor: "#4caf50",
          backgroundColor: theme.palette.primary.main,
          //   transition: "width 0.3s ease",
        })}
      />

      {/* Text overlay */}
      {/* <Box
        sx={{
          position: "absolute",
          left: 8,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Typography variant="description" sx={{ color: percentage > 20 ? "#fff" : "#000" }}>
          {votes} ({percentage}%)
        </Typography>
      </Box> */}
    </Box>
  );
};
