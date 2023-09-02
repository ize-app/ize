import { useLocation } from "react-router-dom";
import { SetupServerGroupRoute, setUpServerRoute } from "../routers/routes";

export const SETUP_SERVER_WIZARD: Wizard = {
  steps: [
    setUpServerRoute(SetupServerGroupRoute.Intro),
    setUpServerRoute(SetupServerGroupRoute.SelectServer),
    setUpServerRoute(SetupServerGroupRoute.HowCultsWorks),
    setUpServerRoute(SetupServerGroupRoute.DefineProcess),
    setUpServerRoute(SetupServerGroupRoute.Finish),
  ],
  stepLookup: {
    [setUpServerRoute(SetupServerGroupRoute.Intro)]: 0,
    [setUpServerRoute(SetupServerGroupRoute.SelectServer)]: 1,
    [setUpServerRoute(SetupServerGroupRoute.HowCultsWorks)]: 2,
    [setUpServerRoute(SetupServerGroupRoute.DefineProcess)]: 3,
    [setUpServerRoute(SetupServerGroupRoute.Finish)]: 4,
  },
};

export interface Wizard {
  steps: string[];
  stepLookup: {
    [key: string]: number;
  };
}

export function useWizard(wizard: Wizard) {
  const location = useLocation();
  const currentStep = wizard.stepLookup[location.pathname] ?? 0;

  const prev = wizard.steps.at(currentStep - 1);
  const next = wizard.steps.at(currentStep + 1);

  return { prev, next };
}
