import { Outlet, useNavigate } from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { Wizard, useWizard } from "../../utils/wizard";
import {
  NEW_REQUEST_WIZARD_STEPS,
  NEW_REQUEST_PROGRESS_BAR_STEPS,
  NewRequestState,
} from "./newRequestWizard";

export const NewRequest = () => {
  const navigate = useNavigate();


  // TODO: Will remove this disable once we put the actual mutation in this function
  // eslint-disable-next-line @typescript-eslint/require-await
  const onComplete = async () => {
    navigate("/");
  };

  const newRequestWizard: Wizard<NewRequestState> = {
    steps: NEW_REQUEST_WIZARD_STEPS,
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
  } = useWizard(newRequestWizard);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        marginTop: "16px",
      }}
    >
      <Stepper activeStep={progressBarStep}>
        {NEW_REQUEST_PROGRESS_BAR_STEPS.map((title) => (
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
  );
};
