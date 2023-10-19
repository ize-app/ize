import { useEditProcessWizardState } from "./editProcessWizard";
import { WizardBody, WizardNav } from "../Shared/Wizard";
export const DiffConfirmation = () => {
  const { formState, onNext, nextLabel, onPrev } = useEditProcessWizardState();
  console.log("final formstate is", formState);
  return (
    <>
      <WizardBody>Diff confirmation</WizardBody>
      <WizardNav onNext={onNext} nextLabel={nextLabel} onPrev={onPrev} />
    </>
  );
};
