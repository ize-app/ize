import { ProcessConfigurationOption } from "../../graphql/generated/graphql";
import { SetupServerGroupRoute, setUpServerRoute } from "../../routers/routes";
import { Wizard, useWizardFormState } from "../../utils/wizard";

export interface SetupServerState {
  serverId?: string;
  processConfigurationOption: ProcessConfigurationOption;
  roleId?: string;
  numberOfResponses?: number;
}

export function useSetupServerGroupWizardState() {
  return useWizardFormState<SetupServerState>();
}

export const SETUP_SERVER_WIZARD: Wizard<SetupServerState> = {
  steps: [
    {
      path: setUpServerRoute(SetupServerGroupRoute.Intro),
      title: "Intro",
      canNext: () => true,
    },
    {
      path: setUpServerRoute(SetupServerGroupRoute.SelectServer),
      title: "Select Server",
      canNext: (formState: SetupServerState) => formState.serverId != null,
    },
    {
      path: setUpServerRoute(SetupServerGroupRoute.HowCultsWorks),
      title: "How Cults Works",
      canNext: () => true,
    },
    {
      path: setUpServerRoute(SetupServerGroupRoute.DefineProcess),
      title: "Define Process",
      canNext: (formState: SetupServerState) =>
        // The user must either be a benevolent dictator or have selected a role
        formState.processConfigurationOption ===
          ProcessConfigurationOption.BenevolentDictator ||
        (formState.roleId != null && formState.numberOfResponses != null),
    },
    {
      path: setUpServerRoute(SetupServerGroupRoute.Finish),
      title: "Finish",
      canNext: () => false,
    },
  ],
  formState: {
    // Default to benevolent dictator
    processConfigurationOption: ProcessConfigurationOption.BenevolentDictator,
  },
};
