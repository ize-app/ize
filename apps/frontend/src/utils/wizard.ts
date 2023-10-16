import { useLocation, useNavigate, useOutletContext } from "react-router-dom";
import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { matchPath } from "react-router-dom";

export type WizardSteps<FormState> = WizardStep<FormState>[];
export interface WizardStep<FormState> {
  title: string;
  path: string;
  progressBarStep: number;
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
  onNext: () => void;
  onPrev: () => void;
  nextLabel: string;
};

export function useWizardFormState<FormState>() {
  return useOutletContext<ContextType<FormState>>();
}

export function useWizard<FormState>(wizard: Wizard<FormState>) {
  const location = useLocation();
  const navigate = useNavigate();

  // navigate back to start of flow if someone tries to navigate dire
  // useEffect(() => {
  //   if (
  //     currentStepIndex !== 0 &&
  //     wizard.steps[currentStepIndex - 1].path !==
  //       // TODO: figure out how to type location state
  //       // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  //       location.state.previousPath
  //   ) {
  //     navigate(wizard.steps[0].path);
  //   }
  // });

  const [formState, setFormState] = useState<FormState>(
    wizard.initialFormState,
  );
  const currentStepIndex = wizard.steps.findIndex((step) => {
    return matchPath(step.path, location.pathname) !== null;
  });

  if (currentStepIndex === -1) {
    throw new Error(
      `Could not find step for path ${location.pathname} in wizard`,
    );
  }
  // Get current step and associated attributes
  const currentStep = wizard.steps.at(currentStepIndex)!;
  const { title, canNext, progressBarStep } = currentStep;
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
        navigate(nextStep!.path, {
          // state: { previousPath: location.pathname },
        });
      }
    : undefined;

  const nextLabel = isFinalStep ? "Finish" : "Next";

  const onPrev = prevStep
    ? () => {
        navigate(prevStep!.path, {
          state: {
            // previousPath: wizard.steps[Math.max(currentStepIndex - 2, 0)].path,
          },
        });
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
  };
}
