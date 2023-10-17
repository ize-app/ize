import { WizardBody, WizardNav } from "../Shared/Wizard";
import { useNewRequestWizardState } from "./newRequestWizard";

export const Confirm = () => {
  const { onNext, onPrev, nextLabel } = useNewRequestWizardState();

  return (
    <>
      <WizardBody>Confirm</WizardBody>
      <WizardNav nextLabel={nextLabel} onPrev={onPrev} onNext={onNext} />
    </>
  );
};
