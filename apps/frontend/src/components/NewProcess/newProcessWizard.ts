import { NewProcessRoute, newProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";

import { ProcessForm } from "@/components/shared/Form/ProcessForm/types";

export function useNewProcessWizardState() {
  return useWizardFormState<ProcessForm>();
}

export const NEW_PROCESS_PROGRESS_BAR_STEPS = ["Template", "Participate", "Evolve", "Finish"];

export const NEW_PROCESS_WIZARD_STEPS: WizardSteps<ProcessForm> = [
  {
    path: newProcessRoute(NewProcessRoute.Intro),
    title: "Request template",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newProcessRoute(NewProcessRoute.Inputs),
    title: "Request template: Inputs",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: (formState: ProcessForm) => !!formState.name,
  },
  {
    path: newProcessRoute(NewProcessRoute.Decisions),
    title: "How decisions are made",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: ProcessForm) => !!formState.inputs,
  },
  {
    path: newProcessRoute(NewProcessRoute.Evolve),
    title: "How process evolves",
    progressBarStep: 2,
    canNext: () => true,
    validWizardState: (formState: ProcessForm) => !!formState.rights,
  },
  {
    path: newProcessRoute(NewProcessRoute.Finish),
    title: "Confirm new process details",
    progressBarStep: 3,
    canNext: () => true,
    validWizardState: (formState: ProcessForm) => !!formState.decision && !!formState.rights,
  },
];
