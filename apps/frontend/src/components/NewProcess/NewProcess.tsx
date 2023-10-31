import { useMutation } from "@apollo/client";
import Box from "@mui/material/Box";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Stepper from "@mui/material/Stepper";
import Typography from "@mui/material/Typography";
import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  FormOptionChoice,
  NEW_PROCESS_PROGRESS_BAR_STEPS,
  NEW_PROCESS_WIZARD_STEPS,
  NewProcessState,
  ProcessRights,
} from "./newProcessWizard";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import {
  InputTemplateArgs,
  NewProcessArgs,
  NewProcessDocument,
  OptionType,
  RoleArgs,
  RoleType,
} from "../../graphql/generated/graphql";
import Head from "../../layout/Head";
import { fullUUIDToShort } from "../../utils/inputs";
import { Wizard, useWizard } from "../../utils/wizard";

const formatRoles = (rights: ProcessRights): RoleArgs[] => {
  const request = rights?.request.map((role) => ({
    id: role.id,
    type: RoleType.Request,
    agentType: role.type,
  })) as RoleArgs[];
  const response = rights?.response.map((role) => ({
    id: role.id,
    type: RoleType.Respond,
    agentType: role.type,
  })) as RoleArgs[];

  return request.concat(response);
};

const formatOptions = (selectedOptionSet: string, customOptions: string[]) => {
  let options;
  if (selectedOptionSet === FormOptionChoice.Checkmark) {
    options = [
      { value: "✅", type: OptionType.Text },
      { value: "❌", type: OptionType.Text },
    ];
  } else if (selectedOptionSet === FormOptionChoice.Emoji) {
    options = [
      { value: "😃", type: OptionType.Text },
      { value: "😐", type: OptionType.Text },
      { value: "😐", type: OptionType.Text },
    ];
  } else
    options = customOptions.map((option) => ({
      value: option,
      type: OptionType.Text,
    }));

  return options;
};

const formatFormStateForMutation = (
  formState: NewProcessState,
): NewProcessArgs => {
  const inputs: NewProcessArgs = {
    name: formState.name as string,
    description: formState.description,
    webhookUri: formState.webhookUri,
    expirationSeconds: formState.decision?.requestExpirationSeconds as number,
    inputs: formState.inputs as InputTemplateArgs[],
    roles: formatRoles(formState.rights as ProcessRights),
    editProcessId: formState.rights?.edit.id as string,
    options: formatOptions(
      formState.options as string,
      formState.customOptions as string[],
    ),
  }; //as NewProcessArgs

  if (formState.decision?.decisionThresholdType === "Absolute") {
    inputs["absoluteDecision"] = {
      threshold: formState.decision.decisionThreshold as number,
    };
  } else if (formState.decision?.decisionThresholdType === "Percentage") {
    inputs["percentageDecision"] = {
      quorum: formState.decision.quorum as number,
      percentage: formState.decision.decisionThreshold as number,
    };
  }

  return inputs;
};

export const SetupProcess = () => {
  const navigate = useNavigate();
  const { setSnackbarData, setSnackbarOpen, snackbarData } =
    useContext(SnackbarContext);

  const [mutate] = useMutation(NewProcessDocument, {
    onCompleted: (data) => {
      const { newProcess: newProcessId } = data;
      navigate(`/groups/${fullUUIDToShort(newProcessId)}`);
    },
  });

  // TODO: Will remove this disable once we put the actual mutation in this function
  // eslint-disable-next-line @typescript-eslint/require-await
  const onComplete = async () => {
    try {
      await mutate({
        variables: {
          process: formatFormStateForMutation(formState),
        },
      });
      setSnackbarData({
        ...snackbarData,
        message: "Process created!",
        type: "success",
      });
      setSnackbarOpen(true);
    } catch {
      navigate("/");
      setSnackbarOpen(true);
      setSnackbarData({ message: "Process creation failed", type: "error" });
    }
  };

  const newProcessWizard: Wizard<NewProcessState> = {
    steps: NEW_PROCESS_WIZARD_STEPS,
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
  } = useWizard(newProcessWizard);

  return (
    <>
      <Head
        title={"Create a process"}
        description={
          "Create a new process for making and automatically executing decisions"
        }
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          flexGrow: 1,
          marginTop: "16px",
        }}
      >
        <Stepper activeStep={progressBarStep}>
          {NEW_PROCESS_PROGRESS_BAR_STEPS.map((title) => (
            <Step key={title}>
              <StepLabel>{title}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant="h1" sx={{ marginTop: "32px" }}>
          {title}
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          <Outlet
            context={{ formState, setFormState, onNext, onPrev, nextLabel }}
          />
        </Box>
      </Box>
    </>
  );
};
