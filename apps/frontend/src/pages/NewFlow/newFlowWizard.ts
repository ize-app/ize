import { WizardSteps, useWizardFormState } from "@/hooks/useWizard";

import { FlowSchemaType } from "../../components/Form/FlowForm/formValidation/flow";
import { NewFlowRoute, newFlowRoute } from "../../routers/routes";

export function useNewFlowWizardState() {
  return useWizardFormState<FlowSchemaType>();
}

export const NEW_FLOW_PROGRESS_BAR_STEPS = ["Setup", "Confirm"];

export const NEW_FLOW_WIZARD_STEPS: WizardSteps<FlowSchemaType> = [
  {
    path: newFlowRoute(NewFlowRoute.Setup),
    title: "New flow setup",
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
