import { useLocation } from "react-router-dom";
import { useState } from "react";

type WizardSteps<FormState> = WizardStep<FormState>[];
export interface WizardStep<FormState> {
  title: string;
  path: string;
  canNext: (formState: FormState) => boolean;
}

export interface Wizard<FormState> {
  steps: WizardSteps<FormState>;
  formState: FormState;
}

export function useWizard<FormState>(wizard: Wizard<FormState>) {
  const location = useLocation();
  const [formState, setFormState] = useState<FormState>(wizard.formState);
  const currentStepIndex =
    wizard.steps.findIndex((step) => step.path === location.pathname) ?? 0;

  let prev, next;
  if (currentStepIndex - 1 >= 0) {
    prev = wizard.steps.at(currentStepIndex - 1)?.path;
  }
  if (currentStepIndex + 1 < wizard.steps.length) {
    next = wizard.steps.at(currentStepIndex + 1)?.path;
  }
  const canNext = wizard.steps.at(currentStepIndex)?.canNext ?? (() => true);
  const title = wizard.steps.at(currentStepIndex)!.title;

  return { prev, next, formState, setFormState, title, canNext };
}
