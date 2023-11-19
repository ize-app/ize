import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { ProcessFormConfirmationTable } from "../components/ProcessFormConfirmationTable";

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
        <Box sx={{ maxWidth: "800px" }}>
          <ProcessFormConfirmationTable process={formState} />
        </Box>
      </WizardBody>
      <WizardNav onNext={onNext} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
