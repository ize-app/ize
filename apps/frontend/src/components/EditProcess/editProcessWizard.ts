import { EditProcessRoute, editProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";

import { ProcessForm } from "@/components/shared/Form/ProcessForm/types";

export interface EditProcessState extends ProcessForm {
  currentProcess?: ProcessForm;
}

export function useEditProcessWizardState() {
  return useWizardFormState<EditProcessState>();
}

export const EDIT_PROCESS_PROGRESS_BAR_STEPS = ["How edits work", "Make edits", "Review edits"];

export const EDIT_PROCESS_WIZARD_STEPS: WizardSteps<EditProcessState> = [
  {
    path: editProcessRoute(EditProcessRoute.Intro),
    title: "How process edits work",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: editProcessRoute(EditProcessRoute.BasicInfo),
    title: "Basic info",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: EditProcessState) => !!formState.currentProcess,
  },
  {
    path: editProcessRoute(EditProcessRoute.Inputs),
    title: "Inputs fields on each request",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: EditProcessState) => !!formState.name,
  },
  {
    path: editProcessRoute(EditProcessRoute.Decisions),
    title: "How decisions are made",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: EditProcessState) => !!formState.inputs,
  },
  {
    path: editProcessRoute(EditProcessRoute.Evolve),
    title: "How process evolves",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: ProcessForm) => !!formState.rights,
  },
  {
    path: editProcessRoute(EditProcessRoute.Confirm),
    title: "Confirm request details",
    progressBarStep: 2,
    canNext: () => true,
    validWizardState: (formState: EditProcessState) => !!formState.decision,
  },
];
