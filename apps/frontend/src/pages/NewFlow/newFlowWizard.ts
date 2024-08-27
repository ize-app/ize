import { WizardSteps, useWizardFormState } from "@/hooks/useWizard";

import { NewFlowWizardFormSchema } from "./formValidation";
import { FlowSchemaType } from "../../components/Form/FlowForm/formValidation/flow";
import { NewFlowRoute, newFlowRoute } from "../../routers/routes";

export function useNewFlowWizardState() {
  return useWizardFormState<NewFlowWizardFormSchema>();
}

export const NEW_FLOW_PROGRESS_BAR_STEPS = ["Setup", "Edit details", "Confirm"];

export const NEW_FLOW_WIZARD_STEPS: WizardSteps<FlowSchemaType> = [
  {
    path: newFlowRoute(NewFlowRoute.InitialSetup),
    title: "Create a new flow",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newFlowRoute(NewFlowRoute.FullConfigSetup),
    title: "Edit flow details",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newFlowRoute(NewFlowRoute.Confirm),
    title: "Confirm",
    progressBarStep: 2,
    canNext: () => true,
    validWizardState: () => true,
  },
];
