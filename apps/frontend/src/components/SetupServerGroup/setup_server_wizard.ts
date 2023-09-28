import { ProcessConfigurationOption } from "../../graphql/generated/graphql";
import { SetupServerGroupRoute, setUpServerRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";

export interface SetupServerState {
  serverId?: string;
  processConfigurationOption: ProcessConfigurationOption;
  roleId?: string;
  numberOfResponses?: number;
}

export function useSetupServerGroupWizardState() {
  return useWizardFormState<SetupServerState>();
}

export const SETUP_SERVER_PROGRESS_BAR_STEPS = [
  "Intro",
  "Select Server",
  "How Cults Works",
  "Define Process",
  "Finish",
];

export const SETUP_SERVER_WIZARD_STEPS: WizardSteps<SetupServerState> = [
  {
    path: setUpServerRoute(SetupServerGroupRoute.Intro),
    title: "Intro",
    progressBarStep: 0,
    canNext: () => true,
  },
  {
    path: setUpServerRoute(SetupServerGroupRoute.SelectServer),
    title: "Select Server",
    progressBarStep: 1,
    canNext: (formState: SetupServerState) => formState.serverId != null,
  },
  {
    path: setUpServerRoute(SetupServerGroupRoute.HowCultsWorks),
    title: "How Cults Works",
    progressBarStep: 2,
    canNext: () => true,
  },
  {
    path: setUpServerRoute(SetupServerGroupRoute.DefineProcess),
    title: "Define Process",
    progressBarStep: 3,
    canNext: (formState: SetupServerState) =>
      // The user must either be a benevolent dictator or have selected a role
      formState.processConfigurationOption ===
        ProcessConfigurationOption.BenevolentDictator ||
      (formState.roleId != null && formState.numberOfResponses != null),
  },
  {
    path: setUpServerRoute(SetupServerGroupRoute.Finish),
    title: "Finish",
    progressBarStep: 4,
    canNext: () => true,
  },
];
