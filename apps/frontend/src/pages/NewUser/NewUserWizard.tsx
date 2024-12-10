import Typography from "@mui/material/Typography";
import Cookies from "js-cookie";
import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import { WizardContainer } from "@/components/Wizard";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { Wizard, useWizard } from "@/hooks/useWizard";
import Head from "@/layout/Head";
import PageContainer from "@/layout/PageContainer";

import {
  NEW_USER_PROGRESS_BAR_STEPS,
  NEW_USER_WIZARD_STEPS,
  NewUserFormSchema,
} from "./newUserWizardSetup";

export const NewUserWizard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { me } = useContext(CurrentUserContext);
  useEffect(() => {
    Cookies.remove("new_user");
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const nextRoute = searchParams.get("next_route");
    console.log("nextRoute", nextRoute);
    setFormState((prev) => ({ ...prev, nextRoute }));
  }, []);

  const onComplete = async () => {
    try {
      await navigate(formState.nextRoute || "/");
    } catch (e) {
      console.log("ERROR: ", e);
    }
  };

  const newUserWizard: Wizard<NewUserFormSchema> = {
    steps: NEW_USER_WIZARD_STEPS,
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
  } = useWizard(newUserWizard);

  return me ? (
    <PageContainer>
      <Head title={"Welcome to Ize"} description={"Set up your account to get started with Ize"} />
      <Typography variant="h1" sx={{ marginTop: "32px" }}>
        {title}
      </Typography>
      <WizardContainer
        progressBarStep={progressBarStep}
        progressBarSteps={NEW_USER_PROGRESS_BAR_STEPS}
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
