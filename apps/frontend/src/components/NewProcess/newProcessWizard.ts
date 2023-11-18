import { InputTemplateArgs } from "../../graphql/generated/graphql";
import { NewProcessRoute, newProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import {
  ActionForm,
  EvolveProcessForm,
  ProcessDecision,
  ProcessRights,
} from "@/components/shared/Form/ProcessForm/types";

export interface NewProcessState {
  name?: string;
  description?: string;
  options?: string;
  customOptions?: string[];
  inputs?: InputTemplateArgs[];
  rights?: ProcessRights;
  decision?: ProcessDecision;
  action?: ActionForm;
  evolve: EvolveProcessForm;
}

export function useNewProcessWizardState() {
  return useWizardFormState<NewProcessState>();
}

export const NEW_PROCESS_PROGRESS_BAR_STEPS = [
  "Template",
  "Participate",
  "Evolve",
  "Finish",
];

export const NEW_PROCESS_WIZARD_STEPS: WizardSteps<NewProcessState> = [
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
    validWizardState: (formState: NewProcessState) => !!formState.name,
  },
  {
    path: newProcessRoute(NewProcessRoute.Decisions),
    title: "How decisions are made",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: NewProcessState) => !!formState.inputs,
  },
  {
    path: newProcessRoute(NewProcessRoute.Evolve),
    title: "How process evolves",
    progressBarStep: 2,
    canNext: () => true,
    validWizardState: (formState: NewProcessState) => !!formState.rights,
  },
  {
    path: newProcessRoute(NewProcessRoute.Finish),
    title: "Confirm new process details",
    progressBarStep: 3,
    canNext: () => true,
    validWizardState: (formState: NewProcessState) =>
      !!formState.decision && !!formState.rights,
  },
];
