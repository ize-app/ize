import { ApolloError, useMutation } from "@apollo/client";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { WizardContainer } from "@/components/Wizard";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { Wizard, useWizard } from "@/utils/wizard";

import { SnackbarContext } from "../../../contexts/SnackbarContext";
import { NewCustomGroupDocument } from "../../../graphql/generated/graphql";
import Head from "../../../layout/Head";
import PageContainer from "../../../layout/PageContainer";
import { fullUUIDToShort } from "../../../utils/inputs";
import { createNewCustomGroupMutation } from "../createNewCustomGroupMutation";
import {
  NEW_CUSTOM_GROUP_PROGRESS_BAR_STEPS,
  NEW_CUSTOM_GROUP_WIZARD_STEPS,
  NewCustomGroupFormFields,
  newCustomGroupFormFieldsDefault,
} from "../newCustomGroupWizard";

export const NewCustomGroup = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen, snackbarData } = useContext(SnackbarContext);
  const { me, setAuthModalOpen } = useContext(CurrentUserContext);

  const [mutate] = useMutation(NewCustomGroupDocument, {
    onCompleted: (data) => {
      data.newCustomGroup;
      const { newCustomGroup: newCustomGroupId } = data;
      navigate(`/groups/${fullUUIDToShort(newCustomGroupId)}`);
    },
  });

  const onComplete = async () => {
    try {
      await mutate({
        variables: createNewCustomGroupMutation(formState),
      });
      setSnackbarData({
        ...snackbarData,
        message: "Group created!",
        type: "success",
      });
      setSnackbarOpen(true);
    } catch (e) {
      console.log("Error: ", e);
      if (e instanceof ApolloError && e.message === "Unauthenticated") {
        setAuthModalOpen(true);
      } else {
        navigate("/");
      }
      setSnackbarOpen(true);
      setSnackbarData({ message: "Group creation failed", type: "error" });
    }
  };

  const newCustomGroupWizard: Wizard<NewCustomGroupFormFields> = {
    steps: NEW_CUSTOM_GROUP_WIZARD_STEPS,
    onComplete,
    initialFormState: newCustomGroupFormFieldsDefault,
  };

  const { onPrev, onNext, progressBarStep, title, formState, setFormState, nextLabel } =
    useWizard(newCustomGroupWizard);

  return me ? (
    <PageContainer>
      <Head title={"Create a group"} description={"Create a new Ize group"} />
      <Typography variant="h1" sx={{ marginTop: "32px" }}>
        {title}
      </Typography>
      <WizardContainer
        progressBarSteps={NEW_CUSTOM_GROUP_PROGRESS_BAR_STEPS}
        progressBarStep={progressBarStep}
      >
        <Outlet context={{ formState, setFormState, onNext, onPrev, nextLabel }} />
      </WizardContainer>
    </PageContainer>
  ) : null;
};
