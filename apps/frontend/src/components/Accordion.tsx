import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box } from "@mui/material";
import { default as MuiAccordion } from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
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
    }}
  >
    <AccordionSummary
      sx={{
        padding: "0px",
      }}
      expandIcon={<ExpandMoreIcon />}
    >
      <Typography color="secondary">{label}</Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ padding: "0px" }}>{children}</AccordionDetails>
  </MuiAccordion>
);
