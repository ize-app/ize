import Box from "@mui/material/Box";

import { useEditProcessWizardState } from "./editProcessWizard";
import formatDiffDataForTable from "./helpers/formatDiffDataForTable";
import { NewProcessState } from "../NewProcess/newProcessWizard";
import { Accordion } from "../shared/Accordion";
import { EditProcessRequestInputTable } from "../shared/Request/EditProcessRequestsInputsTable";
import { WizardBody, WizardNav } from "../shared/Wizard";

export const DiffConfirmation = () => {
  const { onNext, nextLabel, onPrev, formState } = useEditProcessWizardState();
  const [oldChanges, newChanges] = formatDiffDataForTable(
    formState.currentProcess as NewProcessState,
    formState,
  );
  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>
          <Accordion
            id={"request-summary-panel"}
            label="Request summary"
            defaultExpanded={true}
          >
            <EditProcessRequestInputTable
              oldProcess={oldChanges}
              proposedChanges={newChanges}
            />
          </Accordion>
          {/* <Accordion
            id={"process-summary-panel"}
            label="Process summary"
            defaultExpanded={isOverSmScreen}
          >
            <ProcessSummaryTable process={formState.process} />
          </Accordion> */}
        </Box>
      </WizardBody>
      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
