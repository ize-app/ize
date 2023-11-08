import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useEditProcessWizardState } from "./editProcessWizard";
import { processToFormState } from "./helpers/formatProcessDataToFormState";
import { ProcessDocument } from "../../graphql/generated/graphql";
import { shortUUIDToFull } from "../../utils/inputs";
import { WizardBody, WizardNav } from "../shared/Wizard";
export const Intro = () => {
  const { onNext, nextLabel, onPrev, setParams, setFormState } =
    useEditProcessWizardState();
  const { processId: processIdShort } = useParams();
  const processId: string = shortUUIDToFull(processIdShort as string);

  useEffect(() => {
    setParams({ processId: processIdShort });
  }, [setParams, processIdShort]);

  useQuery(ProcessDocument, {
    variables: {
      processId: processId,
    },
    onCompleted: (data) => {
      const formState = processToFormState(data.process);
      setFormState((prev) => ({
        ...prev,
        currentProcess: { ...formState },
        ...formState,
      }));
    },
  });

  return (
    <>
      <WizardBody>Intro</WizardBody>
      <WizardNav onNext={onNext} nextLabel={nextLabel} onPrev={onPrev} />
    </>
  );
};
