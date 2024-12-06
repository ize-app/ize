import { ApolloError, useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { WizardContainer } from "@/components/Wizard";
import { NewFlowDocument } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { Wizard, useWizard } from "@/hooks/useWizard";
import { fullUUIDToShort } from "@/utils/inputs";

import { createNewFlowArgs } from "../../../components/Form/FlowForm/helpers/createNewFlowArgs/createNewFlowArgs";
import { SnackbarContext } from "../../../hooks/contexts/SnackbarContext";
import Head from "../../../layout/Head";
import PageContainer from "../../../layout/PageContainer";
import { NewFlowWizardFormSchema } from "../formValidation";
import { NEW_FLOW_PROGRESS_BAR_STEPS, NEW_FLOW_WIZARD_STEPS } from "../newFlowWizard";

export const NewFlow = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen, snackbarData } = useContext(SnackbarContext);
  const { me, setAuthModalOpen } = useContext(CurrentUserContext);

  const [mutate] = useMutation(NewFlowDocument, {
    onCompleted: (data) => {
      // if reusable flow, flow ID is returned, else request ID is returned
      const { newFlow: id } = data;
      if (formState.new.reusable) navigate(`/flow/${fullUUIDToShort(id)}`);
      else navigate(`/requests/${fullUUIDToShort(id)}`);
    },
  });

  const onComplete = async () => {
    try {
      if (!me?.user.id) throw Error("Missing user Id");
      await mutate({
        variables: {
          newFlow: {
            new: {
              flow: createNewFlowArgs(formState.new.flow, me?.user.id),
              evolve:
                formState.new.reusable && formState.new?.evolve
                  ? createNewFlowArgs(formState.new.evolve, me?.user.id)
                  : undefined,
              reusable: formState.new.reusable,
            },
            groupsToWatch: (formState.groupsToWatch ?? []).map((group) => group.optionId),
          },
        },
      });
      setSnackbarData({
        ...snackbarData,
        message: "Flow created!",
        type: "success",
      });
      setSnackbarOpen(true);
    } catch (e) {
      console.log("ERROR: ", e);
      if (e instanceof ApolloError && e.message === "Unauthenticated") {
        setAuthModalOpen(true);
      } else {
        navigate("/");
      }
      setSnackbarOpen(true);
      setSnackbarData({ message: "Flow creation failed", type: "error" });
    }
  };

  const newFlowWizard: Wizard<NewFlowWizardFormSchema> = {
    steps: NEW_FLOW_WIZARD_STEPS,
    onComplete,
    //@ts-expect-error TODO: fix initial state
    initialFormState: { groupsToWatch: [] },
  };

  const {
    onPrev,
    onNext,
    progressBarStep,
    title,
    formState,
    setFormState,
    nextLabel,
    disableNext,
  } = useWizard(newFlowWizard);

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
        <Outlet context={{ formState, setFormState, onNext, onPrev, nextLabel, disableNext }} />
      </WizardContainer>
    </PageContainer>
  ) : null;
};
