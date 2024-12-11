import { Box, Typography } from "@mui/material";

import { NewUserCTA } from "@/components/NewUserCTA";
import { WizardBody, WizardNav } from "@/components/Wizard";

import { useNewUserWizardState } from "../newUserWizardSetup";

export const Start = () => {
  const { onNext, onPrev, nextLabel, disableNext } = useNewUserWizardState();

  return (
    <form>
      <WizardBody>
        <Box sx={{ display: "flex", flexDirection: "column", maxWidth: "900px", gap: "24px" }}>
          <Typography>You&apos;re all set! Here are a couple ways to get started:</Typography>
          <NewUserCTA />
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} disableNext={disableNext} />
    </form>
  );
};
