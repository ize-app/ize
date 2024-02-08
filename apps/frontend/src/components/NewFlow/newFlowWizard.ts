import * as z from "zod";

import { NewFlowRoute, newFlowRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import { flowSchema } from "../shared/Form/FlowForm/formSchema";

export type NewFlowFormFields = z.infer<typeof flowSchema>;

export function useNewFlowWizardState() {
  return useWizardFormState<NewFlowFormFields>();
}

export const NEW_FLOW_PROGRESS_BAR_STEPS = ["Setup", "Confirm"];

export const NEW_FLOW_WIZARD_STEPS: WizardSteps<NewFlowFormFields> = [
  {
    path: newFlowRoute(NewFlowRoute.Setup),
    title: "New flow Setup",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newFlowRoute(NewFlowRoute.Confirm),
    title: "Confirm",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: () => true,
  },
];
