import Typography from "@mui/material/Typography";

import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";

export const ConfirmNewProcess = () => {
  const { formState, onPrev, onNext, nextLabel } = useNewProcessWizardState();

  return (
    <>
      <WizardBody>
        <Typography variant="body1">
          Almost done! Confirm the details for how{" "}
          <span style={{ fontWeight: "bold" }}>
            {formState.name ?? "this process"}
          </span>{" "}
          works. Click "Finish" to create the process.
        </Typography>
      </WizardBody>
      <WizardNav onNext={onNext} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
