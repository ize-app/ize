import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { default as MuiAccordion } from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";

export const Accordion = ({
  id,
  label,
  children,
  elevation = 1,
  defaultExpanded = false,
}: {
  id: string;
  label: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  elevation?: number;
}) => (
  <MuiAccordion defaultExpanded={defaultExpanded} id={id} elevation={elevation}>
    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
      <Typography color="primary" fontWeight={"500"}>
        {label}
      </Typography>
    </AccordionSummary>
    <AccordionDetails sx={{ padding: "0px" }}>{children}</AccordionDetails>
  </MuiAccordion>
);
