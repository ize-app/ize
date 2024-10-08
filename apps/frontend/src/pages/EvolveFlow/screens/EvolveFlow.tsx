import { useMutation, useQuery } from "@apollo/client";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useContext, useEffect } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";

import createFlowFormState from "@/components/Form/FlowForm/helpers/createFlowFormState";
import { createNewFlowArgs } from "@/components/Form/FlowForm/helpers/createNewFlowArgs/createNewFlowArgs";
import Loading from "@/components/Loading";
import {
  FlowFragment,
  GetFlowDocument,
  NewEvolveRequestDocument,
} from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";
import { Wizard, useWizard } from "@/hooks/useWizard";
import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";
import { fullUUIDToShort, shortUUIDToFull } from "@/utils/inputs";

import { EVOLVE_FLOW_PROGRESS_BAR_STEPS, EVOLVE_FLOW_WIZARD_STEPS } from "../evolveFlowWizard";
import { EvolveExistingFlowSchemaType } from "../formValidation";

export const EvolveFlow = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const { me, setIdentityModalState, setAuthModalOpen } = useContext(CurrentUserContext);
  const { flowId: flowIdShort } = useParams();
  const flowId: string = shortUUIDToFull(flowIdShort as string);

  const { loading } = useQuery(GetFlowDocument, {
    variables: {
      flowId,
      isForEvolveRequest: true,
    },
    onCompleted: (data) => {
      const formState = createFlowFormState(data.getFlow as FlowFragment);
      setFormState((prev) => {
        return {
          ...prev,
          newFlow: { ...formState },
          currentFlow: formState,
        };
      });
    },
  });

  const [mutate] = useMutation(NewEvolveRequestDocument, {
    onCompleted: (data) => {
      const newRequestId = data.newEvolveRequest;
      navigate(`/requests/${fullUUIDToShort(newRequestId)}`);
      setSnackbarOpen(true);
      setSnackbarData({ message: "Request created!", type: "success" });
    },
    onError: (data) => {
      // navigate("/");
      if (data.graphQLErrors[0].extensions.code === "InsufficientPermissions") {
        setIdentityModalState({ type: "request", permission: undefined });
      } else if (data.graphQLErrors[0].extensions.code === "Unauthenticated") {
        setAuthModalOpen(true);
      }
      setSnackbarOpen(true);
      setSnackbarData({ message: "Request creation failed", type: "error" });
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
            proposedFlow: createNewFlowArgs(formState.newFlow, me?.user.id),
            currentFlow: createNewFlowArgs(formState.currentFlow, me?.user.id),
          },
        },
      });
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const editProcessWizard: Wizard<EvolveExistingFlowSchemaType> = {
    steps: EVOLVE_FLOW_WIZARD_STEPS,
    onComplete,
    //@ts-expect-error TODO fix
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
