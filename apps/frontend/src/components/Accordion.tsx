import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { Box } from "@mui/material";
import { default as MuiAccordion } from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary, { accordionSummaryClasses } from "@mui/material/AccordionSummary";
import Typography from "@mui/material/Typography";

export const Accordion = ({
  label,
  children,
  elevation = 1,
  defaultExpanded = false,
}: {
  label: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  elevation?: number;
}) => (
  <MuiAccordion
    slotProps={{ heading: { component: "h4" } }}
    defaultExpanded={defaultExpanded}
    elevation={elevation}
    component={Box}
    disableGutters
    sx={{
      maxWidth: "600px",
      "&:before": {
        display: "none", // Removes the default top border
      },
      "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
        transform: "rotate(90deg)",
      },
    }}
  >
    <AccordionSummary
      sx={(theme) => ({
        flexDirection: "row-reverse",
        [`& .${accordionSummaryClasses.content}`]: {
          marginLeft: theme.spacing(1),
        },
        padding: "0px",
      })}
      expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    >
      <Typography color="secondary">{label}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ padding: "0px" }}>{children}</AccordionDetails>
  </MuiAccordion>
);
