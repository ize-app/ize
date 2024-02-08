import Box from "@mui/material/Box";

import { WizardBody, WizardNav } from "../shared/Wizard";
import Typography from "@mui/material/Typography";
import { useNewFlowWizardState } from "./newFlowWizard";

export const Confirm = () => {
  const { onNext, formState, onPrev, nextLabel } = useNewFlowWizardState();

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
