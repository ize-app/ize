import { EditProcessRoute, editProcessRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";

export interface EditProcessState {
  processName?: string;
}

export function useEditProcessWizardState() {
  return useWizardFormState<EditProcessState>();
}

export const EDIT_PROCESS_PROGRESS_BAR_STEPS = [
  "How edits work",
  "Make edits",
  "Review edits",
];

export const EDIT_PROCESS_WIZARD_STEPS: WizardSteps<EditProcessState> = [
  {
    path: editProcessRoute(EditProcessRoute.Intro),
    title: "How process edits work",
    progressBarStep: 0,
    canNext: () => true,
  },
  {
    path: editProcessRoute(EditProcessRoute.BasicInfo),
    title: "Basic info",
    progressBarStep: 1,
    canNext: () => true,
  },
  {
    path: editProcessRoute(EditProcessRoute.Inputs),
    title: "Inputs fields on each request",
    progressBarStep: 1,
    canNext: () => true,
  },
  {
    path: editProcessRoute(EditProcessRoute.Decisions),
    title: "How decisions are made",
    progressBarStep: 1,
    canNext: () => true,
  },
  {
    path: editProcessRoute(EditProcessRoute.Confirm),
    title: "Review edits and create request",
    progressBarStep: 2,
    canNext: () => true,
  },
];
