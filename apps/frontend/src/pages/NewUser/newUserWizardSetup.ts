import { WizardSteps, useWizardFormState } from "@/hooks/useWizard";

import { NewUserRoute, newUserRoute } from "../../routers/routes";

export interface NewUserFormSchema {
  nextRoute?: string | null | undefined;
}

export function useNewUserWizardState() {
  return useWizardFormState<NewUserFormSchema>();
}

export const NEW_USER_PROGRESS_BAR_STEPS = ["Welcome!", "Connect identities", "Get started"];

export const NEW_USER_WIZARD_STEPS: WizardSteps<NewUserFormSchema> = [
  {
    path: newUserRoute(NewUserRoute.Welcome),
    title: "Welcome to Ize",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newUserRoute(NewUserRoute.GetStarted),
    title: "Connect identities",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: () => true,
  },
];
