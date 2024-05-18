import { useMutation, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import { EVOLVE_FLOW_PROGRESS_BAR_STEPS, EVOLVE_FLOW_WIZARD_STEPS } from "../evolveFlowWizard";
import { EvolveExistingFlowSchemaType } from "../formValidation";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import {
  FlowFragment,
  GetFlowDocument,
  NewEvolveRequestDocument,
} from "../../../graphql/generated/graphql";
import Head from "../../../layout/Head";
import PageContainer from "../../../layout/PageContainer";
import { Wizard, useWizard } from "../../../utils/wizard";

import { fullUUIDToShort, shortUUIDToFull } from "@/utils/inputs";
import Loading from "../../../components/Loading";
import createFlowFormState from "@/components/Form/FlowForm/helpers/createFlowFormState";
import { createNewFlowArgs } from "@/components/Form/FlowForm/helpers/createNewFlowArgs/createNewFlowArgs";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const EvolveFlow = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const { me } = useContext(CurrentUserContext);
  const { flowId: flowIdShort } = useParams();
  const flowId: string = shortUUIDToFull(flowIdShort as string);

  const { loading } = useQuery(GetFlowDocument, {
    variables: {
      flowId,
    },
    onCompleted: (data) => {
      const formState = createFlowFormState(data.getFlow as FlowFragment);
      setFormState((prev) => {
        return {
          ...formState,
          ...prev,
          currentFlow: formState,
        };
      });
    },
  });

  const [mutate] = useMutation(NewEvolveRequestDocument, {
    onCompleted: (data) => {
      const newRequestId = data.newEvolveRequest;
      navigate(`/requests/${fullUUIDToShort(newRequestId)}`);
    },
  });

  const onComplete = async () => {
    try {
      if (!me?.user.id) throw Error("Missing user Id");
      
      await mutate({
        variables: {
          request: {
            flowId: flowId,
            name: formState.requestName,
            description: formState.requestDescription,
            proposedFlow: createNewFlowArgs(formState, me?.user.id),
            currentFlow: createNewFlowArgs(formState.currentFlow, me?.user.id),
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

  const editProcessWizard: Wizard<EvolveExistingFlowSchemaType> = {
    steps: EVOLVE_FLOW_WIZARD_STEPS,
    onComplete,
    //@ts-ignore
    initialFormState: {},
  };

  const { onPrev, onNext, progressBarStep, title, formState, setFormState, nextLabel, setParams } =
    useWizard(editProcessWizard);

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
