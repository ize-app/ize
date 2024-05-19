import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { useState } from "react";
import { WarningOutlined } from "@mui/icons-material";
import { SxProps } from "@mui/material";

export const PanelAccordion = ({
  children,
  title,
  hasError,
  sx = {},
}: {
  children: React.ReactNode;
  title: string;
  hasError: boolean;
  sx?: SxProps;
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return (
    <Accordion
      disableGutters
      elevation={0}
      expanded={isExpanded}
      square
      sx={{ borderTop: "1px solid rgba(0, 0, 0, 0.1)", borderBottom: "none", ...sx }}
      onChange={() => {
        setIsExpanded(!isExpanded);
      }}
    >
      <AccordionSummary
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
          "& .MuiAccordionSummary-content": {
            margin: "0px",
          },
        }}
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-start",
            width: "100%",
          }}
        >
          <Typography color="secondary" variant={"label2"}>
            {title.toLocaleUpperCase()}
          </Typography>
          {hasError && (
            <WarningOutlined color={"error"} fontSize="small" sx={{ marginLeft: "8px" }} />
          )}
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};
