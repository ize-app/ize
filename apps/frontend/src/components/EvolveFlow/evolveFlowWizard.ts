import { EvolveFlowRoute, evolveFlowRoute } from "../../routers/routes";
import { WizardSteps, useWizardFormState } from "../../utils/wizard";
import { EvolveExistingFlowSchemaType } from "../shared/Form/FlowForm/formValidation/flow";

export function useEvolveFlowWizardState() {
  return useWizardFormState<EvolveExistingFlowSchemaType>();
}
export const EVOLVE_FLOW_PROGRESS_BAR_STEPS = ["Evolve", "Review evolution"];

export const EVOLVE_FLOW_WIZARD_STEPS: WizardSteps<EvolveExistingFlowSchemaType> = [
  {
    path: evolveFlowRoute(EvolveFlowRoute.Setup),
    title: "Flow evolution",
    progressBarStep: 1,
    canNext: () => true,
    // validWizardState: (formState: EvolveExistingFlowSchemaType) => !!formState.currentFlow,
    validWizardState: () => true,
  },
  {
    path: evolveFlowRoute(EvolveFlowRoute.Confirm),
    title: "Confirm evoution request",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: EvolveExistingFlowSchemaType) => !!formState.name,
  },
];
