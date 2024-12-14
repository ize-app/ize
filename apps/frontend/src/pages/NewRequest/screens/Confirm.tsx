import Box from "@mui/material/Box";

import { WizardBody, WizardNav } from "../../../components/Wizard";
import { useNewRequestWizardState } from "../newRequestWizard";

export const Confirm = () => {
  const { onNext, onPrev, nextLabel, disableNext } = useNewRequestWizardState();

  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>Submit to trigger this flow.</Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} disableNext={disableNext} />
    </>
  );
};
