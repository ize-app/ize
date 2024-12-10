import { useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { WizardContainer } from "@/components/Wizard";
import { NewRequestDocument } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { SnackbarContext } from "@/hooks/contexts/SnackbarContext";
import { Wizard, useWizard } from "@/hooks/useWizard";
import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";
import { fullUUIDToShort } from "@/utils/inputs";

import { createNewRequestMutationArgs } from "../createNewRequestMutationArgs";
import {
  NEW_REQUEST_PROGRESS_BAR_STEPS,
  NEW_REQUEST_WIZARD_STEPS,
  NewRequestFormSchema,
} from "../newRequestWizard";

export const NewRequestWizard = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const { setAuthModalOpen, setIdentityModalState, me } = useContext(CurrentUserContext);

  const [mutate] = useMutation(NewRequestDocument, {
    onCompleted: (data) => {
      const newRequestId = data.newRequest;
      navigate(`/requests/${fullUUIDToShort(newRequestId)}`);
      setSnackbarOpen(true);
      setSnackbarData({ message: "Request created!", type: "success" });
    },
    onError: (data) => {
      if (data.graphQLErrors[0]?.extensions?.code === "InsufficientPermissions") {
        setIdentityModalState({ type: "request", permission: undefined });
      } else if (data.graphQLErrors[0]?.extensions?.code === "Unauthenticated") {
        setAuthModalOpen(true);
      }
      setSnackbarOpen(true);
      setSnackbarData({ message: "Request creation failed", type: "error" });
    },
  });

  const onComplete = async () => {
    try {
      const args = createNewRequestMutationArgs(formState);
      // console.log("args are", args);
      await mutate({
        variables: { request: args },
      });
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const newRequestWizard: Wizard<NewRequestFormSchema> = {
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
    params,
    setParams,
    disableNext,
  } = useWizard(newRequestWizard);

  return me ? (
    <PageContainer>
      <Head
        title={"Create a request"}
        description={"Propose a new decision by creating a request."}
      />
      <Typography variant="h1" sx={{ marginTop: "32px" }}>
        {title}
      </Typography>
      <WizardContainer
        progressBarStep={progressBarStep}
        progressBarSteps={NEW_REQUEST_PROGRESS_BAR_STEPS}
      >
        <Outlet
          context={{
            formState,
            setFormState,
            onNext,
            onPrev,
            nextLabel,
            params,
            setParams,
            disableNext,
          }}
        />
      </WizardContainer>
    </PageContainer>
  ) : null;
};
