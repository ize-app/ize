import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import Head from "../../../layout/Head";
import PageContainer from "../../../layout/PageContainer";
import { Wizard, useWizard } from "@/utils/wizard";
import { NEW_FLOW_PROGRESS_BAR_STEPS, NEW_FLOW_WIZARD_STEPS } from "../newFlowWizard";
import { FlowSchemaType } from "../../../components/Form/FlowForm/formValidation/flow";
import { NewFlowDocument } from "@/graphql/generated/graphql";
import { ApolloError, useMutation } from "@apollo/client";
import { createNewFlowArgs } from "../../../components/Form/FlowForm/helpers/createNewFlowArgs/createNewFlowArgs";
import { fullUUIDToShort } from "@/utils/inputs";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { WizardContainer } from "@/components/Wizard";

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
  );
};
