import { useEditProcessWizardState } from "./editProcessWizard";
import { WizardBody, WizardNav } from "../shared/Wizard";

export const DiffConfirmation = () => {
  const { onNext, nextLabel, onPrev } = useEditProcessWizardState();
  return (
    <>
      <WizardBody>Diff confirmation</WizardBody>
      <WizardNav onNext={onNext} nextLabel={nextLabel} onPrev={onPrev} />
    </>
  );
};
