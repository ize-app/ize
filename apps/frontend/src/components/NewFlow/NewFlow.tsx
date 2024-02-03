import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { Wizard, useWizard } from "@/utils/wizard";
import {
  NEW_FLOW_PROGRESS_BAR_STEPS,
  NEW_FLOW_WIZARD_STEPS,
  NewFlowFormFields,
  useNewFlowWizardState,
} from "./newFlowWizard";

export const NewFlow = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen, snackbarData } = useContext(SnackbarContext);

  // const [mutate] = useMutation(NewProcessDocument, {
  //   onCompleted: (data) => {
  //     const { newProcess: newProcessId } = data;
  //     navigate(`/processes/${fullUUIDToShort(newProcessId)}`);
  //   },
  // });

  const onComplete = async () => {
    try {
      // await mutate({
      //   variables: {
      //     process: createProcessMutation(formState),
      //   },
      // });
      setSnackbarData({
        ...snackbarData,
        message: "Flow created!",
        type: "success",
      });
      setSnackbarOpen(true);
    } catch {
      navigate("/");
      setSnackbarOpen(true);
      setSnackbarData({ message: "Process creation failed", type: "error" });
    }
  };

  const newFlowWizard: Wizard<NewFlowFormFields> = {
    steps: NEW_FLOW_WIZARD_STEPS,
    onComplete,
    //@ts-ignore
    initialFormState: {},
  };

  const { onPrev, onNext, progressBarStep, title, formState, setFormState, nextLabel } =
    useWizard(newFlowWizard);

  return (
    <PageContainer>
      <Head
        title={"Create a flow"}
        description={"Create a new flow for collective thinking and action."}
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
          {NEW_FLOW_PROGRESS_BAR_STEPS.map((title) => (
            <Step key={title}>
              <StepLabel>{title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="h1" sx={{ marginTop: "32px" }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Outlet context={{ formState, setFormState, onNext, onPrev, nextLabel }} />
        </Box>
      </Box>
    </PageContainer>
  );
};
