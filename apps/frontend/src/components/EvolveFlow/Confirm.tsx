import Box from "@mui/material/Box";

import { WizardBody, WizardNav } from "../shared/Wizard";
import Typography from "@mui/material/Typography";
import { useEvolveFlowWizardState } from "./evolveFlowWizard";

export const Confirm = () => {
  const { onNext, formState, onPrev, nextLabel } = useEvolveFlowWizardState();

  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>
          <Typography>
            Confirm your flow.
            {/* <span style={{ fontWeight: "bold" }}>{formState.name}</span> */}
          </Typography>
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
