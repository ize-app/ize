import { ProcessSummaryPartsFragment } from "../../graphql/generated/graphql";
import { NewRequestRoute, newRequestRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";

export interface NewRequestState {
  process?: ProcessSummaryPartsFragment;
  userInputs?: UserInputs;
}

export interface UserInputs {
  [inputId: string]: string | number;
}

export function useNewRequestWizardState() {
  return useWizardFormState<NewRequestState>();
}

export const NEW_REQUEST_PROGRESS_BAR_STEPS = [
  "Select process",
  "Create request",
  "Confirm",
];

export const NEW_REQUEST_WIZARD_STEPS: WizardSteps<NewRequestState> = [
  {
    path: newRequestRoute(NewRequestRoute.SelectProcess),
    title: "Select process",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newRequestRoute(NewRequestRoute.CreateRequest),
    title: "Create request",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newRequestRoute(NewRequestRoute.Confirm),
    title: "Confirm",
    progressBarStep: 2,
    canNext: () => true,
    validWizardState: (formState: NewRequestState) => {
      return !!formState.userInputs;
    },
  },
];
