import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useNewRequestWizardState } from "./newRequestWizard";
import { Accordion } from "../shared/Accordion";
import { RequestInputTable } from "../shared/Request";
import { ProcessSummaryTable } from "../shared/Request/ProcessSummary";
import { WizardBody, WizardNav } from "../shared/Wizard";

export const Confirm = () => {
  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { onNext, formState, onPrev, nextLabel } = useNewRequestWizardState();

  const inputs =
    formState.process && formState.userInputs
      ? formState.process.inputs.map((inputMetadata) => ({
          name: inputMetadata.name,
          value: formState.userInputs ? formState.userInputs[inputMetadata.id] : "-",
        }))
      : [];

  return formState.process && formState.userInputs ? (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>
          <Accordion id={"request-summary-panel"} label="Request summary" defaultExpanded={true}>
            <RequestInputTable inputs={inputs} />
          </Accordion>
          <Accordion
            id={"process-summary-panel"}
            label="Process summary"
            defaultExpanded={isOverSmScreen}
          >
            <ProcessSummaryTable process={formState.process} />
          </Accordion>
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  ) : null;
};
