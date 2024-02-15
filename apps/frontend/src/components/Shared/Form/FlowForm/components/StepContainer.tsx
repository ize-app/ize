import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";

import Accordion, { AccordionProps } from "@mui/material/Accordion";
import AccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";

export const StepContainer = ({
  children,
  expandedStep,
  stepIndex,
  title,
  handleStepExpansion,
}: {
  children: React.ReactNode;
  expandedStep: number | false;
  stepIndex: number;
  title: string;
  handleStepExpansion: (_event: React.SyntheticEvent, newExpanded: boolean) => void;
}) => {
  return (
    <Accordion
      expanded={expandedStep === stepIndex}
      disableGutters
      onChange={handleStepExpansion}
      sx={{}}
    >
      <AccordionSummary
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
        }}
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      >
        <Typography variant="h3" fontWeight={400}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails
        sx={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: "20px" }}
      >
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

export const StepComponentContainer = ({
  label,
  children,
}: {
  label?: string;
  children: React.ReactNode;
}) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column" }}>
      {label && (
        <Typography color="primary" fontWeight={"500"} marginBottom="16px" fontSize="1.25rem">
          {label}
        </Typography>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>{children}</Box>
    </Box>
  );
};
