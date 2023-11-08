import { useQuery } from "@apollo/client";
import { useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useEditProcessWizardState } from "./editProcessWizard";
import { processToFormState } from "./helpers/formatProcessDataToFormState";
import { SnackbarContext } from "../../contexts/SnackbarContext";
import { ProcessDocument } from "../../graphql/generated/graphql";
import { shortUUIDToFull } from "../../utils/inputs";
import { WizardBody, WizardNav } from "../shared/Wizard";
export const Intro = () => {
  const { onNext, nextLabel, onPrev, setParams, setFormState } =
    useEditProcessWizardState();
  const { setSnackbarData, setSnackbarOpen } = useContext(SnackbarContext);
  const { processId: processIdShort } = useParams();
  const processId: string = shortUUIDToFull(processIdShort as string);
  const navigate = useNavigate();

  useEffect(() => {
    setParams({ processId: processIdShort });
  }, [setParams, processIdShort]);

  const { error } = useQuery(ProcessDocument, {
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

  const onError = () => {
    navigate("/");
    setSnackbarOpen(true);
    setSnackbarData({ message: "Invalid process", type: "error" });
  };

  if (error) onError();

  return (
    <>
      <WizardBody>Intro</WizardBody>
      <WizardNav onNext={onNext} nextLabel={nextLabel} onPrev={onPrev} />
    </>
  );
};
