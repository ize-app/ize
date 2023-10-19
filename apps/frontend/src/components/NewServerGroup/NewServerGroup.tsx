import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { Outlet, useNavigate } from "react-router-dom";

import {
  NEW_SERVER_PROGRESS_BAR_STEPS,
  NEW_SERVER_WIZARD_STEPS,
  NewServerState,
} from "./newServerWizard";
import {
  CreateDiscordServerGroupDocument,
  CreateDiscordServerGroupInput,
  ProcessConfigurationOption,
} from "../../graphql/generated/graphql";
import { Wizard, useWizard } from "../../utils/wizard";

export const NewServerGroup = () => {
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

  const newServerWizard: Wizard<NewServerState> = {
    steps: NEW_SERVER_WIZARD_STEPS,
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
  } = useWizard(newServerWizard);

  return (
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
  );
};
