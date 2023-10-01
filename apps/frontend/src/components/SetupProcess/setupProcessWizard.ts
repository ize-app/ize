import { SetupProcessRoute, setUpProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";

export interface SetupProcessState {
  processName?: string;
  description?: string;
  webhookUri?: string;
}

export function useSetupProcessWizardState() {
  return useWizardFormState<SetupProcessState>();
}

export const SETUP_PROCESS_PROGRESS_BAR_STEPS = [
  "Process type",
  "Inputs",
  "Options",
  "Rights",
  "Finish",
];

export const SETUP_PROCESS_WIZARD_STEPS: WizardSteps<SetupProcessState> = [
  {
    path: setUpProcessRoute(SetupProcessRoute.Intro),
    title: "Create a New Process",
    progressBarStep: 0,
    canNext: () => true,
  },
  {
    path: setUpProcessRoute(SetupProcessRoute.Inputs),
    title: "What inputs does a requestor need to enter?",
    progressBarStep: 1,
    canNext: () => true,
  },
  {
    path: setUpProcessRoute(SetupProcessRoute.Options),
    title: "What options do respondants choose between?",
    progressBarStep: 2,
    canNext: () => true,
  },
  {
    path: setUpProcessRoute(SetupProcessRoute.Rights),
    title: "How can this process be used and editted?",
    progressBarStep: 3,
    canNext: () => true,
  },
  {
    path: setUpProcessRoute(SetupProcessRoute.Finish),
    title: "Finish",
    progressBarStep: 4,
    canNext: () => true,
  },
];
