import Box from "@mui/material/Box";

import { useEditProcessWizardState } from "../../../../EditProcess/editProcessWizard";
import { ProcessForm } from "@/components/shared/Form/ProcessForm/types";
import { WizardBody, WizardNav } from "../../../Wizard";
import { ProcessFormConfirmationTable } from "../components/ProcessFormConfirmationTable";
import getEvolveDiffForDisplay from "../helpers/getEvolveDiffForDisplay";

export const DiffConfirmation = () => {
  const { onNext, nextLabel, onPrev, formState } = useEditProcessWizardState();
  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "1000px", marginTop: "24px" }}>
          <ProcessFormConfirmationTable
            process={formState.currentProcess as ProcessForm}
            evolvedProcess={formState}
            fields={getEvolveDiffForDisplay(
              formState.currentProcess as ProcessForm,
              formState,
            )}
          />
        </Box>
      </WizardBody>
      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
