import { useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  NEW_REQUEST_PROGRESS_BAR_STEPS,
  NEW_REQUEST_WIZARD_STEPS,
  NewRequestFormSchema,
} from "../newRequestWizard";
import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { NewRequestDocument } from "../../../graphql/generated/graphql";
import Head from "../../../layout/Head";
import PageContainer from "../../../layout/PageContainer";
import { fullUUIDToShort } from "../../../utils/inputs";
import { Wizard, useWizard } from "../../../utils/wizard";
import { WizardContainer } from "@/components/Wizard";
import { createNewRequestMutationArgs } from "../createNewRequestMutationArgs";
import { ApolloError } from "@apollo/client";
import { CurrentUserContext } from "@/contexts/current_user_context";

export const NewRequest = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const { setAuthModalOpen, me } = useContext(CurrentUserContext);

  const [mutate] = useMutation(NewRequestDocument, {
    onCompleted: (data) => {
      const newRequestId = data.newRequest;
      navigate(`/requests/${fullUUIDToShort(newRequestId)}`);
    },
  });

  const onComplete = async () => {
    try {
      // console.log("args are", createNewRequestMutationArgs(formState));
      await mutate({
        variables: { request: createNewRequestMutationArgs(formState) },
      });

      setSnackbarOpen(true);
      setSnackbarData({ message: "Request created!", type: "success" });
    } catch (e) {
      console.log("ERROR: ", e);
      if (e instanceof ApolloError && e.message === "Unauthenticated") {
        setAuthModalOpen(true);
      } else {
        navigate("/");
      }
      setSnackbarOpen(true);
      setSnackbarData({ message: "Request creation failed", type: "error" });
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
          }}
        />
      </WizardContainer>
    </PageContainer>
  ) : null;
};
