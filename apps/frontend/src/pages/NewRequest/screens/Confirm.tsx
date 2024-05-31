import Box from "@mui/material/Box";

import { WizardBody, WizardNav } from "../../../components/Wizard";
import { useNewRequestWizardState } from "../newRequestWizard";

export const Confirm = () => {
  const { onNext, onPrev, nextLabel } = useNewRequestWizardState();

  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>Submit to finalize your request.</Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
