import { Flow } from "../../graphql/generated/graphql";
import { NewRequestRoute, newRequestRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import { RequestDefinedOptionsSchemaType } from "./formValidation";
import { FieldAnswerRecordSchemaType } from "../../components/Form/formValidation/field";

export interface NewRequestFormSchema {
  flow?: Flow;
  requestFields?: FieldAnswerRecordSchemaType;
  requestDefinedOptions?: RequestDefinedOptionsSchemaType;
  name?: string;
}

export interface RequestFields {
  [inputId: string]: string | number;
}

export function useNewRequestWizardState() {
  return useWizardFormState<NewRequestFormSchema>();
}

export const NEW_REQUEST_PROGRESS_BAR_STEPS = ["Select process", "Create request", "Confirm"];

export const NEW_REQUEST_WIZARD_STEPS: WizardSteps<NewRequestFormSchema> = [
  {
    path: newRequestRoute(NewRequestRoute.SelectFlow),
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
    validWizardState: (_formState: NewRequestFormSchema) => {
      // return !!formState.requestFields;
      return true;
    },
  },
];
