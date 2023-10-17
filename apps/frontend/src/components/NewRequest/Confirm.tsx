import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { WizardBody, WizardNav } from "../Shared/Wizard";
import { RequestInputTable } from "../shared/Request";
import { useNewRequestWizardState } from "./newRequestWizard";
import { ProcessSummaryTable } from "../Shared/Request/ProcessSummary";
import { Accordion } from "../Shared/Accordion";

import { Process } from "../../types";

export const Confirm = () => {
  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { onNext, formState, onPrev, nextLabel } = useNewRequestWizardState();
  const inputs =
    formState.process && formState.userInputs
      ? formState.process.inputs.map((inputMetadata) => ({
          property: inputMetadata.name,
          value: formState.userInputs
            ? formState.userInputs[inputMetadata.inputId]
            : "-",
        }))
      : [];
  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>
          <Accordion
            id={"request-summary-panel"}
            label="Request summary"
            defaultExpanded={true}
          >
            <RequestInputTable inputs={inputs} />
          </Accordion>
          <Accordion
            id={"process-summary-panel"}
            label="Process summary"
            defaultExpanded={isOverSmScreen}
          >
            <ProcessSummaryTable
              process={formState.process as Process.default}
            />
          </Accordion>
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
