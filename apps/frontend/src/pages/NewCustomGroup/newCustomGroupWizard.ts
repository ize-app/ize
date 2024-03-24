import { NewCustomGroupRoute, newCustomGroupRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import * as z from "zod";
import { newCustomGroupFormSchema, NewCustomGroupSchemaType } from "./formValidation";

export type NewCustomGroupFormFields = z.infer<typeof newCustomGroupFormSchema>;

export const newCustomGroupFormFieldsDefault: NewCustomGroupFormFields = {
  members: [],
  name: "",
};

export function useNewCustomGroupWizardState() {
  return useWizardFormState<NewCustomGroupFormFields>();
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
