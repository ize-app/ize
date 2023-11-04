import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useEditProcessWizardState } from "./editProcessWizard";
import { WizardBody, WizardNav } from "../shared/Wizard";
export const Intro = () => {
  const { onNext, nextLabel, onPrev, setParams } = useEditProcessWizardState();
  const { processId } = useParams();

  useEffect(() => {
    setParams({ processId });
  }, [setParams, processId]);

  return (
    <>
      <WizardBody>Intro</WizardBody>
      <WizardNav onNext={onNext} nextLabel={nextLabel} onPrev={onPrev} />
    </>
  );
};
