import { CurrentUserProvider } from "../../contexts/current_user_context";
import { Outlet, useNavigate } from "react-router-dom";
import { Wizard, useWizard } from "../../utils/wizard";
import {
  SETUP_SERVER_WIZARD_STEPS,
  SetupServerState,
} from "./setup_server_wizard";
import { Box, Button, Stack, Typography } from "@mui/material";
import {
  CreateDiscordServerGroupDocument,
  CreateDiscordServerGroupInput,
  ProcessConfigurationOption,
} from "../../graphql/generated/graphql";
import { useMutation } from "@apollo/client";

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

  const { onPrev, onNext, title, canNext, formState, setFormState, nextLabel } =
    useWizard(setupServerWizard);

  return (
    <CurrentUserProvider>
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
    </CurrentUserProvider>
  );
};
