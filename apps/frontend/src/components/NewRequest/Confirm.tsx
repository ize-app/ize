import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useNewRequestWizardState } from "./newRequestWizard";
import { Accordion } from "../shared/Accordion";
import { RequestInputTable } from "../shared/Request";
import { ProcessSummaryTable } from "../shared/Request/ProcessSummary";
import { WizardBody, WizardNav } from "../shared/Wizard";

export const Confirm = () => {
  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { onNext, formState, onPrev, nextLabel } = useNewRequestWizardState();

  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>Sup</Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
