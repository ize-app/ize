import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction, useState } from "react";

export type WizardSteps<FormState> = WizardStep<FormState>[];
export interface WizardStep<FormState> {
  title: string;
  path: string;
  canNext: (formState: FormState) => boolean;
}

export interface Wizard<FormState> {
  steps: WizardSteps<FormState>;
  initialFormState: FormState;
  onComplete?: () => Promise<void>;
}

type ContextType<FormState> = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
};

export function useWizardFormState<FormState>() {
  return useOutletContext<ContextType<FormState>>();
}

export function useWizard<FormState>(wizard: Wizard<FormState>) {
  const location = useLocation();
  const navigate = useNavigate();
  const [formState, setFormState] = useState<FormState>(
    wizard.initialFormState,
  );
  const currentStepIndex = wizard.steps.findIndex(
    (step) => step.path === location.pathname,
  );

  if (currentStepIndex === -1) {
    throw new Error(
      `Could not find step for path ${location.pathname} in wizard`,
    );
  }

  // Get current step and associated attributes
  const currentStep = wizard.steps.at(currentStepIndex)!;
  const { title, canNext } = currentStep;
  const isFinalStep = currentStepIndex === wizard.steps.length - 1;

  // Get the previous and next steps if they exist
  let prevStep: WizardStep<FormState> | undefined;
  let nextStep: WizardStep<FormState> | undefined;

  if (currentStepIndex - 1 >= 0) {
    prevStep = wizard.steps.at(currentStepIndex - 1);
  }
  if (currentStepIndex + 1 < wizard.steps.length) {
    nextStep = wizard.steps.at(currentStepIndex + 1);
  }

  const onNext = isFinalStep
    ? wizard.onComplete
    : nextStep
    ? () => {
        navigate(nextStep!.path);
      }
    : undefined;

  const nextLabel = isFinalStep ? "Finish" : "Next";

  const onPrev = prevStep
    ? () => {
        navigate(prevStep!.path);
      }
    : undefined;

  return { onPrev, onNext, nextLabel, formState, setFormState, title, canNext };
}
