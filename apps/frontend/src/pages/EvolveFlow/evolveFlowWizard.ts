import { WizardSteps, useWizardFormState } from "@/hooks/useWizard";

import { EvolveExistingFlowSchemaType } from "./formValidation";
import { EvolveFlowRoute, evolveFlowRoute } from "../../routers/routes";

export function useEvolveFlowWizardState() {
  return useWizardFormState<EvolveExistingFlowSchemaType>();
}
export const EVOLVE_FLOW_PROGRESS_BAR_STEPS = ["Evolve", "Context", "Review"];

export const EVOLVE_FLOW_WIZARD_STEPS: WizardSteps<EvolveExistingFlowSchemaType> = [
  {
    path: evolveFlowRoute(EvolveFlowRoute.Setup),
    title: "Flow evolution",
    progressBarStep: 0,
    canNext: () => true,
    // validWizardState: (formState: EvolveExistingFlowSchemaType) => !!formState.currentFlow,
    validWizardState: () => true,
  },
  {
    path: evolveFlowRoute(EvolveFlowRoute.Context),
    title: "Add context",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: evolveFlowRoute(EvolveFlowRoute.Confirm),
    title: "Confirm evoution request",
    progressBarStep: 2,
    canNext: () => true,
    validWizardState: (formState: EvolveExistingFlowSchemaType) => !!formState.name,
  },
];
