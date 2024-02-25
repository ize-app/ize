import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Params,
  generatePath,
  matchPath,
  useLocation,
  useNavigate,
  useOutletContext,
} from "react-router-dom";

export type WizardSteps<FormState> = WizardStep<FormState>[];
export interface WizardStep<FormState> {
  title: string;
  path: string;
  progressBarStep: number;
  canNext: (formState: FormState) => boolean;
  validWizardState: (formState: FormState) => boolean;
}

export interface Wizard<FormState> {
  steps: WizardSteps<FormState>;
  initialFormState: FormState;
  onComplete?: () => Promise<void>;
}

type ContextType<FormState> = {
  formState: FormState;
  setFormState: Dispatch<SetStateAction<FormState>>;
  onNext: () => void;
  onPrev: () => void;
  params: Params;
  setParams: Dispatch<SetStateAction<Params>>;
  validWizardState: (formState: FormState) => boolean;
  nextLabel: string;
};

export function useWizardFormState<FormState>() {
  return useOutletContext<ContextType<FormState>>();
}

export function useWizard<FormState>(wizard: Wizard<FormState>) {
  const location = useLocation();
  const navigate = useNavigate();

  const [formState, setFormState] = useState<FormState>(wizard.initialFormState);

  const [params, setParams] = useState<Params>({});

  const currentStepIndex = wizard.steps.findIndex((step) => {
    return matchPath(step.path, location.pathname) !== null;
  });

  if (currentStepIndex === -1) {
    throw new Error(`Could not find step for path ${location.pathname} in wizard`);
  }
  // Get current step and associated attributes
  const currentStep = wizard.steps.at(currentStepIndex)!;
  const { title, canNext, progressBarStep, validWizardState } = currentStep;
  const isFinalStep = currentStepIndex === wizard.steps.length - 1;

  // if state is invlaid (i.e. user navigates directly to middle of the flow), then navigate back to start of wizard
  useEffect(() => {
    if (!validWizardState(formState)) {
      navigate(wizard.steps[0].path);
    }
  }, [navigate, validWizardState, formState, wizard.steps]);

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
          navigate(generatePath(nextStep!.path, params));
        }
      : undefined;

  const nextLabel = isFinalStep ? "Finish" : "Next";

  const onPrev = prevStep
    ? () => {
        navigate(generatePath(prevStep!.path, params));
      }
    : undefined;

  return {
    onPrev,
    onNext,
    progressBarStep,
    nextLabel,
    formState,
    setFormState,
    title,
    canNext,
    params,
    setParams,
  };
}
