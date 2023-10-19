import { useNavigate } from "react-router-dom";

import { useNewProcessWizardState } from "./newProcessWizard";
import { WizardBody, WizardNav } from "../Shared/Wizard";
import { Typography } from "@mui/material";

export const ProcessFinish = () => {
  const { formState, onPrev, onNext, nextLabel } = useNewProcessWizardState();

  const navigate = useNavigate();

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
