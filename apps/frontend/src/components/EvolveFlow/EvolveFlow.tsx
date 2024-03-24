import { useMutation, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { EVOLVE_FLOW_PROGRESS_BAR_STEPS, EVOLVE_FLOW_WIZARD_STEPS } from "./evolveFlowWizard";
import { EvolveExistingFlowSchemaType } from "../shared/Form/FlowForm/formValidation/flow";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import {
  Flow,
  GetFlowDocument,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import PageContainer from "../../layout/PageContainer";
import { Wizard, useWizard } from "../../utils/wizard";

import { fullUUIDToShort, shortUUIDToFull } from "@/utils/inputs";
import Loading from "../shared/Loading";
import { createFormStateForExistingFlow } from "../shared/Form/FlowForm/helpers/createEvolveFlowFormState/createEvolveFlowFormState";

export const EvolveFlow = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const { flowId: flowIdShort } = useParams();
  const flowId: string = shortUUIDToFull(flowIdShort as string);

  const { error, data, loading } = useQuery(GetFlowDocument, {
    variables: {
      flowId,
    },
    onCompleted: (data) => {
      const formState = createFormStateForExistingFlow(data.getFlow as Flow);
      setFormState((prev) => {
        return {
          ...prev,
          ...formState,
          currentFlow: formState,
        };
      });
    },
  });

  // const [mutate] = useMutation(NewEditProcessRequestDocument, {
  //   onCompleted: (data) => {
  //     const newRequestId = data.newEditProcessRequest;
  //     navigate(`/requests/${fullUUIDToShort(newRequestId)}`);
  //   },
  // });

  const onComplete = async () => {
    try {
      // await mutate({
      //   variables: {
      //     inputs: {
      //       processId: shortUUIDToFull(params.processId as string),
      //       currentProcess: createProcessMutation(formState.currentProcess as ProcessForm),
      //       evolvedProcess: createProcessMutation(formState),
      //     },
      //   },
      // });

      setSnackbarOpen(true);
      setSnackbarData({ message: "Request created!", type: "success" });
      navigate("/");
    } catch (e) {
      navigate("/");
      setSnackbarOpen(true);
      setSnackbarData({ message: "Request creation failed", type: "error" });
    }
  };

  const editProcessWizard: Wizard<EvolveExistingFlowSchemaType> = {
    steps: EVOLVE_FLOW_WIZARD_STEPS,
    onComplete,
    //@ts-ignore
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

  useEffect(() => {
    setParams({ flowId: flowIdShort });
  }, [setParams, flowIdShort]);

  return (
    <PageContainer>
      <Head title={"Evolve Flow"} description={"Evolve what this flow does."} />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginTop: "16px",
        }}
      >
        <Stepper activeStep={progressBarStep}>
          {EVOLVE_FLOW_PROGRESS_BAR_STEPS.map((title) => (
            <Step key={title}>
              <StepLabel>{title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="h1" sx={{ marginTop: "32px" }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          {loading || !formState.currentFlow ? (
            <Loading />
          ) : (
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
          )}
        </Box>
      </Box>
    </PageContainer>
  );
};
