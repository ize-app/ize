import { FlowFragment } from "@/graphql/generated/graphql";
import { WizardSteps, useWizardFormState } from "@/hooks/useWizard";

import { RequestSchemaType } from "./requestValidation";
import { NewRequestRoute, newRequestRoute } from "../../routers/routes";

export interface NewRequestFormSchema {
  flow?: FlowFragment;
  request?: RequestSchemaType;
}

export interface RequestFields {
  [inputId: string]: string | number;
}

export function useNewRequestWizardState() {
  return useWizardFormState<NewRequestFormSchema>();
}

export const NEW_REQUEST_PROGRESS_BAR_STEPS = ["Select flow", "Create request", "Confirm"];

export const NEW_REQUEST_WIZARD_STEPS: WizardSteps<NewRequestFormSchema> = [
  {
    path: newRequestRoute(NewRequestRoute.SelectFlow),
    title: "Select flow to trigger",
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
    validWizardState: (_formState: NewRequestFormSchema) => {
      // return !!formState.requestFields;
      return true;
    },
  },
];
