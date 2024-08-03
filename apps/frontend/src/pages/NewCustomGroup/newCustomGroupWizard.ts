import { WizardSteps, useWizardFormState } from "@/hooks/useWizard";

import { NewCustomGroupSchemaType } from "./formValidation";
import { NewCustomGroupRoute, newCustomGroupRoute } from "../../routers/routes";

export const newCustomGroupFormFieldsDefault: NewCustomGroupSchemaType = {
  members: [],
  name: "",
  notification: {},
};

export function useNewCustomGroupWizardState() {
  return useWizardFormState<NewCustomGroupSchemaType>();
}

export const NEW_CUSTOM_GROUP_PROGRESS_BAR_STEPS = ["Setup", "Finish"];

export const NEW_CUSTOM_GROUP_WIZARD_STEPS: WizardSteps<NewCustomGroupSchemaType> = [
  {
    path: newCustomGroupRoute(NewCustomGroupRoute.Setup),
    title: "Setup group",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newCustomGroupRoute(NewCustomGroupRoute.Finish),
    title: "Confirm new group creation",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: NewCustomGroupSchemaType) => !!formState.name,
  },
];
