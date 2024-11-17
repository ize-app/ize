import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import { diff } from "deep-object-diff";

import { WizardBody, WizardNav } from "@/components/Wizard";

import { useEvolveFlowWizardState } from "../evolveFlowWizard";

export const Confirm = () => {
  const { onNext, onPrev, nextLabel } = useEvolveFlowWizardState();

  // const diffFlow = diff(formState, formState.currentFlow);

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
