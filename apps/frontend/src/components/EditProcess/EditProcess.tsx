import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { Outlet, useNavigate } from "react-router-dom";

import {
  EDIT_PROCESS_PROGRESS_BAR_STEPS,
  EDIT_PROCESS_WIZARD_STEPS,
  EditProcessState,
} from "./editProcessWizard";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { Wizard, useWizard } from "../../utils/wizard";

export const EditProcess = () => {
  const navigate = useNavigate();

  // TODO: Will remove this disable once we put the actual mutation in this function
  // eslint-disable-next-line @typescript-eslint/require-await
  const onComplete = async () => {
    navigate("/");
  };

  const editProcessWizard: Wizard<EditProcessState> = {
    steps: EDIT_PROCESS_WIZARD_STEPS,
    onComplete,
    initialFormState: {},
  };

  const {
    onPrev,
    onNext,
    progressBarStep,
    title,
    formState,
    setFormState,
    nextLabel,
  } = useWizard(editProcessWizard);

  return (
    <PageContainer>
      <Head
        title={"Edit process"}
        description={
          "Edit what this process does and how your group arrives at a deicion."
        }
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginTop: "16px",
        }}
      >
        <Stepper activeStep={progressBarStep}>
          {EDIT_PROCESS_PROGRESS_BAR_STEPS.map((title) => (
            <Step key={title}>
              <StepLabel>{title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="h1" sx={{ marginTop: "32px" }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Outlet
            context={{ formState, setFormState, onNext, onPrev, nextLabel }}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};
