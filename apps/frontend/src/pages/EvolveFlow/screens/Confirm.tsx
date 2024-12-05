// import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
// import { useForm } from "react-hook-form";

// import { groupsToWatchSchema } from "@/components/Form/SelectGroupsToWatchForm/selectGroupsValidation";
import { WizardBody, WizardNav } from "@/components/Wizard";

import { useEvolveFlowWizardState } from "../evolveFlowWizard";

export const Confirm = () => {
  const { onNext, onPrev, nextLabel } = useEvolveFlowWizardState();
  // const formMethods = useForm({
  //   defaultValues: [],
  //   resolver: zodResolver(groupsToWatchSchema),
  //   shouldUnregister: true,
  // });

  // const diffFlow = diff(formState, formState.currentFlow);

  return (
    <>
      <WizardBody>
        <Box sx={{ maxWidth: "800px" }}>
          <Typography>
            Confirm your flow.
            {/* <span style={{ fontWeight: "bold" }}>{formState.name}</span> */}
          </Typography>
        </Box>
      </WizardBody>

      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
