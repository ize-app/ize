import { SetupProcessRoute, setUpProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";

export interface SetupProcessState {
  processName?: string;
  description?: string;
  customIntegration?: string;
  webhookUri?: string;
  options?: string;
  customOptions?: string[];
  inputs?: ProcessInput[];
}

export interface ProcessInput {
  fieldName: string;
  description: string;
  required: boolean;
  type: ProcessInputType;
}

export enum ProcessInputType {
  Text = "Text",
  Number = "Number",
}

export function useSetupProcessWizardState() {
  return useWizardFormState<SetupProcessState>();
}

export const SETUP_PROCESS_PROGRESS_BAR_STEPS = [
  "Process type",
  "Inputs",
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
    path: setUpProcessRoute(SetupProcessRoute.Rights),
    title: "How can this process be used and editted?",
    progressBarStep: 2,
    canNext: () => true,
  },
  {
    path: setUpProcessRoute(SetupProcessRoute.Finish),
    title: "Finish",
    progressBarStep: 3,
    canNext: () => true,
  },
];
