import { NewServerGroupRoute, newServerRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";

export interface NewServerState {
  serverId?: string;
  serverName?: string;
}

export function useNewServerGroupWizardState() {
  return useWizardFormState<NewServerState>();
}

export const NEW_SERVER_PROGRESS_BAR_STEPS = [
  "Select Server",
  "How Cults Works",
  "Define Process",
  "Finish",
];

export const NEW_SERVER_WIZARD_STEPS: WizardSteps<NewServerState> = [
  {
    path: newServerRoute(NewServerGroupRoute.SelectServer),
    title: "Select Server",
    progressBarStep: 0,
    canNext: (formState: NewServerState) => formState.serverId != null,
    validWizardState: () => true,
  },
  {
    path: newServerRoute(NewServerGroupRoute.HowCultsWorks),
    title: "How Cults Works",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: () => true,
  },
  // {
  //   path: newServerRoute(NewServerGroupRoute.DefineProcess),
  //   title: "Define Process",
  //   progressBarStep: 2,
  //   canNext: (formState: NewServerState) =>
  //     // The user must either be a benevolent dictator or have selected a role
  //     formState.processConfigurationOption ===
  //       ProcessConfigurationOption.BenevolentDictator ||
  //     (formState.roleId != null && formState.numberOfResponses != null),
  //   validWizardState: (formState: NewServerState) => !!formState.serverId,
  // },
  {
    path: newServerRoute(NewServerGroupRoute.Finish),
    title: "Finish",
    progressBarStep: 3,
    canNext: () => true,
    validWizardState: (formState: NewServerState) => !!formState.serverId,
  },
];
