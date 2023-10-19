import { Typography } from "@mui/material";

import { useNewProcessWizardState } from "./newProcessWizard";
import { WizardBody, WizardNav } from "../shared/Wizard";

export const ProcessFinish = () => {
  const { formState, onPrev, onNext, nextLabel } = useNewProcessWizardState();

  return (
    <>
      <WizardBody>
        <Typography variant="body1">
          Almost done! Confirm the details for how{" "}
          <span style={{ fontWeight: "bold" }}>
            {formState.processName ?? "this process"}
          </span>{" "}
          works. Click "Finish" to create the process.
        </Typography>
      </WizardBody>
      <WizardNav onNext={onNext} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
