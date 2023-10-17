import { useEditProcessWizardState } from "./editProcessWizard";
import { WizardBody, WizardNav } from "../Shared/Wizard";
export const Intro = () => {
  const { onNext, nextLabel, onPrev } = useEditProcessWizardState();
  return (
    <>
      <WizardBody>Intro</WizardBody>
      <WizardNav onNext={onNext} nextLabel={nextLabel} onPrev={onPrev} />
    </>
  );
};
