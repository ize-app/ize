import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

import { useNewRequestWizardState } from "../newRequestWizard";
import { WizardBody, WizardNav } from "../../../components/Wizard";

export const Confirm = () => {
  console.log("inside confirm");
  const theme = useTheme();
  const isOverSmScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const { onNext, formState, onPrev, nextLabel } = useNewRequestWizardState();

  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>Submit to finalize your request.</Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
