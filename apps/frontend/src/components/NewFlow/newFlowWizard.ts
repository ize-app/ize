import { NewFlowRoute, newFlowRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import { FlowSchemaType } from "../shared/Form/FlowForm/formValidation/flow";

export function useNewFlowWizardState() {
  return useWizardFormState<FlowSchemaType>();
}

export const NEW_FLOW_PROGRESS_BAR_STEPS = ["Setup", "Confirm"];

export const NEW_FLOW_WIZARD_STEPS: WizardSteps<FlowSchemaType> = [
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
