import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { FormHelperText } from "@mui/material";

export const StepContainer = ({
  children,
  expandedStep,
  stepIdentifier,
  title,
  hasError,
  handleStepExpansion,
}: {
  children: React.ReactNode;
  expandedStep: string | false;
  stepIdentifier: string | "Trigger";
  title: string;
  hasError: boolean;
  handleStepExpansion: (_event: React.SyntheticEvent, newExpanded: boolean) => void;
}) => {
  const isExpanded = expandedStep === stepIdentifier;
  return (
    <Accordion expanded={isExpanded} disableGutters onChange={handleStepExpansion} sx={{}}>
      <AccordionSummary
        sx={{
          "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
            transform: "rotate(90deg)",
          },
        }}
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
      >
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
          <Typography variant="h3" fontWeight={400}>
            {title}
          </Typography>
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {hasError && !isExpanded ? "Error in this step" : null}
          </FormHelperText>
        </Box>
      </AccordionSummary>
      <AccordionDetails
        sx={{ padding: "16px 16px", display: "flex", flexDirection: "column", gap: "16px" }}
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
