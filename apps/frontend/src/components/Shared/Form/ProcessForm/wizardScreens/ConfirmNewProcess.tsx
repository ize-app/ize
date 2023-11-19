import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import { useNewProcessWizardState } from "@/components/NewProcess/newProcessWizard";
import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { ProcessFormConfirmationTable } from "../components/ProcessFormConfirmationTable";
import { Accordion } from "@/components/shared/Accordion";
import { ProcessFormDisplayFields as Fields } from "../components/ProcessFormConfirmationTable";

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
        <Box sx={{ maxWidth: "800px", marginTop: "24px" }}>
          <Accordion label="Request Template" id="request-template-summary">
            <ProcessFormConfirmationTable
              process={formState}
              fields={[
                Fields.Name,
                Fields.Description,
                Fields.Inputs,
                Fields.Options,
                Fields.Action,
              ]}
            />
          </Accordion>
          <Accordion label="Decision" id="decision-summary">
            <ProcessFormConfirmationTable
              process={formState}
              fields={[Fields.Decision, Fields.Request, Fields.Respond]}
            />
          </Accordion>
          <Accordion label="Decision" id="decision-summary">
            <ProcessFormConfirmationTable
              process={formState}
              fields={[
                Fields.DecisionEvolve,
                Fields.RequestEvolve,
                Fields.RespondEvolve,
              ]}
            />
          </Accordion>
        </Box>
      </WizardBody>
      <WizardNav onNext={onNext} onPrev={onPrev} nextLabel={nextLabel} />
    </>
  );
};
