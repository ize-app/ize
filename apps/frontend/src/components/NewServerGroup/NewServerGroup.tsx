import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  NEW_SERVER_PROGRESS_BAR_STEPS,
  NEW_SERVER_WIZARD_STEPS,
  NewServerState,
} from "./newServerWizard";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import {
  SetUpDiscordServerGroupDocument,
  SetUpDiscordServerInput,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import { fullUUIDToShort } from "../../utils/inputs";
import { Wizard, useWizard } from "../../utils/wizard";

export const NewServerGroup = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);

  const [mutate] = useMutation(SetUpDiscordServerGroupDocument, {
    onCompleted: (data) => {
      const newGroupId = data.setUpDiscordServer.id;
      navigate(`/groups/${fullUUIDToShort(newGroupId)}`);
    },
  });

  const onComplete = async () => {
    try {
      if ((formState as SetUpDiscordServerInput).serverId == null) {
        throw new Error("No server selected.");
      }
      await mutate({
        variables: {
          input: { ...(formState as SetUpDiscordServerInput) },
        },
      });
    } catch {
      navigate("/");
      setSnackbarOpen(true);
      setSnackbarData({ message: "Group setup failed", type: "error" });
    }
  };

  const newServerWizard: Wizard<NewServerState> = {
    steps: NEW_SERVER_WIZARD_STEPS,
    onComplete,
    initialFormState: {},
  };

  const {
    onPrev,
    onNext,
    progressBarStep,
    title,
    canNext,
    formState,
    setFormState,
    nextLabel,
  } = useWizard(newServerWizard);

  return (
    <>
      <Head
        title={"Create a group"}
        description={
          "Create a Cults group to collaboratively create and evolve your communal decision-making processes"
        }
      />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          flexGrow: 1,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            marginTop: "16px",
          }}
        >
          <Stepper activeStep={progressBarStep}>
            {NEW_SERVER_PROGRESS_BAR_STEPS.map((title) => (
              <Step key={title}>
                <StepLabel>{title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <Typography variant="h1" sx={{ marginTop: "32px" }}>
            {title}
          </Typography>
          <Box sx={{ flexGrow: 1 }}>
            <Outlet context={{ formState, setFormState }} />
          </Box>
        </Box>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          marginTop="16px"
          height="80px"
        >
          {onPrev ? (
            <div>
              <Button variant="outlined" onClick={onPrev}>
                Previous
              </Button>
            </div>
          ) : (
            /** To keep next on the right when there is no prev we render an empty div */ <div />
          )}
          {onNext && (
            <div>
              <Button
                disabled={!canNext(formState)}
                variant="contained"
                onClick={onNext}
              >
                {nextLabel}
              </Button>
            </div>
          )}
        </Stack>
      </Box>
    </>
  );
};
