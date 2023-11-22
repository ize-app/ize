import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  EDIT_PROCESS_PROGRESS_BAR_STEPS,
  EDIT_PROCESS_WIZARD_STEPS,
  EditProcessState,
} from "./editProcessWizard";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { NewEditProcessRequestDocument } from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { Wizard, useWizard } from "../../utils/wizard";
import { ProcessForm } from "@/components/shared/Form/ProcessForm/types";
import { createProcessMutation } from "../shared/Form/ProcessForm/createProcessMutation";

const EditProcess = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);

  const [mutate] = useMutation(NewEditProcessRequestDocument, {
    onCompleted: (data) => {
      // const newRequestId = data.newEditProcessRequest;
      // navigate(`/requests/${fullUUIDToShort(newRequestId)}`);
    },
  });

  const onComplete = async () => {
    try {
      await mutate({
        variables: {
          inputs: {
            processId: params.processId as string,
            currentProcess: createProcessMutation(
              formState.currentProcess as ProcessForm,
            ),
            evolvedProcess: createProcessMutation(formState),
          },
        },
      });

      setSnackbarOpen(true);
      setSnackbarData({ message: "Request created!", type: "success" });
      navigate("/");
    } catch (e) {
      navigate("/");
      setSnackbarOpen(true);
      setSnackbarData({ message: "Request creation failed", type: "error" });
    }
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
    params,
    setParams,
  } = useWizard(editProcessWizard);

  return (
    <PageContainer>
      <Head
        title={"Edit process"}
        description={
          "Edit what this process does and how your group arrives at a decision."
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
            context={{
              formState,
              setFormState,
              onNext,
              onPrev,
              nextLabel,
              setParams,
            }}
          />
        </Box>
      </Box>
    </PageContainer>
  );
};

export default EditProcess;
