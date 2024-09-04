import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { WizardBody, WizardNav } from "../../../components/Wizard";
import { useNewCustomGroupWizardState } from "../newCustomGroupWizard";

export const Policy = () => {
  const { onNext, formState, onPrev, nextLabel } = useNewCustomGroupWizardState();

  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>
          <Typography>
            You are about to create a group for{" "}
            <span style={{ fontWeight: "bold" }}>{formState.name}</span>
            <br />
            <br />
            This new group has collaborative <em>flows</em> that define how your group manages
            itself - how it adds members, sends notifications, changes it&apos;s name, and how
            process can change over time. <br />
            <br />
            By default, each of your flows allows any group member to propose a change but only you
            can approve any changes. You can change how this approval process works by{" "}
            <em>evolving</em> any given flow.
            <br />
            <br />
            Good luck, have fun!
          </Typography>
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
