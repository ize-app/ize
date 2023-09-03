import { ProcessConfigurationOption } from "../../graphql/generated/graphql";
import { SetupServerGroupRoute, setUpServerRoute } from "../../routers/routes";
import { Wizard, useWizardFormState } from "../../utils/wizard";

export interface SetupServerState {
  serverId?: string;
  processConfigurationOption: ProcessConfigurationOption;
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
      canNext: () => true,
    },
    {
      path: setUpServerRoute(SetupServerGroupRoute.HowCultsWorks),
      title: "How Cults Works",
      canNext: () => true,
    },
    {
      path: setUpServerRoute(SetupServerGroupRoute.DefineProcess),
      title: "Define Process",
      canNext: () => true,
    },
    {
      path: setUpServerRoute(SetupServerGroupRoute.Finish),
      title: "Finish",
      canNext: () => true,
    },
  ],
  formState: {
    // Default to benevolent dictator
    processConfigurationOption: ProcessConfigurationOption.BenevolentDictator,
  },
};
