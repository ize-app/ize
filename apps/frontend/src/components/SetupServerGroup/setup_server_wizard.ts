import { SetupServerGroupRoute, setUpServerRoute } from "../../routers/routes";
import { Wizard } from "../../utils/wizard";

interface SetupServerState {
  serverId?: string;
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
  formState: {},
};
