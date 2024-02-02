import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";

import { WizardBody, WizardNav } from "../shared/Wizard";
import { useNewCustomGroupWizardState } from "./newCustomGroupWizard";
import Typography from "@mui/material/Typography";

export const Confirm = () => {
  const { onNext, formState, onPrev, nextLabel } = useNewCustomGroupWizardState();

  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>
          <Typography>
            Confirm you want to create a group for{" "}
            <span style={{ fontWeight: "bold" }}>{formState.name}</span>
          </Typography>
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
