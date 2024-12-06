import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { WizardBody, WizardNav } from "../../../components/Wizard";
import { useNewFlowWizardState } from "../newFlowWizard";

export const Confirm = () => {
  const { onNext, onPrev, nextLabel, disableNext } = useNewFlowWizardState();

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

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} disableNext={disableNext} />
    </>
  );
};
