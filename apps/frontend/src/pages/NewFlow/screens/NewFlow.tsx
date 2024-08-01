import { ApolloError, useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { WizardContainer } from "@/components/Wizard";
import { NewFlowDocument } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { Wizard, useWizard } from "@/hooks/useWizard";
import { fullUUIDToShort } from "@/utils/inputs";

import { FlowSchemaType } from "../../../components/Form/FlowForm/formValidation/flow";
import { createNewFlowArgs } from "../../../components/Form/FlowForm/helpers/createNewFlowArgs/createNewFlowArgs";
import { SnackbarContext } from "../../../hooks/contexts/SnackbarContext";
import Head from "../../../layout/Head";
import PageContainer from "../../../layout/PageContainer";
import { NEW_FLOW_PROGRESS_BAR_STEPS, NEW_FLOW_WIZARD_STEPS } from "../newFlowWizard";

export const NewFlow = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen, snackbarData } = useContext(SnackbarContext);
  const { me, setAuthModalOpen } = useContext(CurrentUserContext);

  const [mutate] = useMutation(NewFlowDocument, {
    onCompleted: (data) => {
      const { newFlow: newFlowId } = data;
      navigate(`/flow/${fullUUIDToShort(newFlowId)}`);
    },
  });

  const onComplete = async () => {
    try {
      if (!me?.user.id) throw Error("Missing user Id");
      await mutate({
        variables: {
          flow: createNewFlowArgs(formState, me?.user.id),
        },
      });
      setSnackbarData({
        ...snackbarData,
        message: "Flow created!",
        type: "success",
      });
      setSnackbarOpen(true);
    } catch (e) {
      if (e instanceof ApolloError && e.message === "Unauthenticated") {
        setAuthModalOpen(true);
      } else {
        navigate("/");
      }
      setSnackbarOpen(true);
      setSnackbarData({ message: "Process creation failed", type: "error" });
    }
  };

  const newFlowWizard: Wizard<FlowSchemaType> = {
    steps: NEW_FLOW_WIZARD_STEPS,
    onComplete,
    //@ts-expect-error TODO: fix initial state
    initialFormState: {},
  };

  const { onPrev, onNext, progressBarStep, title, formState, setFormState, nextLabel } =
    useWizard(newFlowWizard);

  return me ? (
    <PageContainer>
      <Head
        title={"Create a flow"}
        description={"Create a new flow for collective thinking and action."}
      />
      <Typography variant="h1" sx={{ marginTop: "32px" }}>
        {title}
      </Typography>
      <WizardContainer
        progressBarStep={progressBarStep}
        progressBarSteps={NEW_FLOW_PROGRESS_BAR_STEPS}
      >
        <Outlet context={{ formState, setFormState, onNext, onPrev, nextLabel }} />
      </WizardContainer>
    </PageContainer>
  ) : null;
};
