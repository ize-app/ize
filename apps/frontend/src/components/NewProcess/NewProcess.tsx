import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { formatFormStateForProcessMutation } from "./newProcessMutationHelpers/formatFormStateForProcessMutation";
import {
  NEW_PROCESS_PROGRESS_BAR_STEPS,
  NEW_PROCESS_WIZARD_STEPS,
  NewProcessState,
} from "./newProcessWizard";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { NewProcessDocument } from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { fullUUIDToShort } from "../../utils/inputs";
import { Wizard, useWizard } from "../../utils/wizard";

export const SetupProcess = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen, snackbarData } =
    useContext(SnackbarContext);

  const [mutate] = useMutation(NewProcessDocument, {
    onCompleted: (data) => {
      const { newProcess: newProcessId } = data;
      navigate(`/processes/${fullUUIDToShort(newProcessId)}`);
    },
  });

  const onComplete = async () => {
    try {
      await mutate({
        variables: {
          process: formatFormStateForProcessMutation(formState),
        },
      });
      setSnackbarData({
        ...snackbarData,
        message: "Process created!",
        type: "success",
      });
      setSnackbarOpen(true);
    } catch {
      navigate("/");
      setSnackbarOpen(true);
      setSnackbarData({ message: "Process creation failed", type: "error" });
    }
  };

  const newProcessWizard: Wizard<NewProcessState> = {
    steps: NEW_PROCESS_WIZARD_STEPS,
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
  } = useWizard(newProcessWizard);

  return (
    <PageContainer>
      <Head
        title={"Create a process"}
        description={
          "Create a new process for making and automatically executing decisions"
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
          {NEW_PROCESS_PROGRESS_BAR_STEPS.map((title) => (
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
