import { Outlet, useNavigate } from "react-router-dom";

import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import { Wizard, useWizard } from "../../utils/wizard";
import {
  SETUP_SERVER_WIZARD_STEPS,
  SETUP_SERVER_PROGRESS_BAR_STEPS,
  SetupServerState,
} from "./setup_server_wizard";
import {
  CreateDiscordServerGroupDocument,
  CreateDiscordServerGroupInput,
  ProcessConfigurationOption,
} from "../../graphql/generated/graphql";

export const SetupServerGroup = () => {
  const navigate = useNavigate();
  const [mutate] = useMutation(CreateDiscordServerGroupDocument, {
    onCompleted: (data) => {
      const newGroupId = data.createDiscordServerGroup.id;
      navigate(`/groups/${newGroupId}`);
    },
  });

  const onComplete = async () => {
    if (formState.serverId == null) {
      throw new Error("No server selected.");
    }

    await mutate({
      variables: {
        input: { ...(formState as CreateDiscordServerGroupInput) },
      },
    });
  };

  const setupServerWizard: Wizard<SetupServerState> = {
    steps: SETUP_SERVER_WIZARD_STEPS,
    onComplete,
    initialFormState: {
      processConfigurationOption: ProcessConfigurationOption.BenevolentDictator,
    },
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
  } = useWizard(setupServerWizard);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        maxWidth: "100%",
        marginTop: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "1000px",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Stepper activeStep={progressBarStep}>
            {SETUP_SERVER_PROGRESS_BAR_STEPS.map((title) => (
              <Step key={title}>
                <StepLabel>{title}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Typography variant="h1">{title}</Typography>
        <Box minHeight="500px">
          <Outlet context={{ formState, setFormState }} />
        </Box>
        <Stack direction="row" justifyContent="space-between">
          {onPrev ? (
            <div>
              {" "}
              <Button variant="contained" onClick={onPrev}>
                Previous
              </Button>
            </div>
          ) : (
            /** To keep next on the right when there is no prev we render an empty div */ <div />
          )}
          {onNext && (
            <div>
              {" "}
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
    </Box>
  );
};
