import { useForm } from "react-hook-form";

import { FlowSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { WizardNav } from "@/components/Wizard";

import { generateNewFlowConfig } from "../generateNewFlowConfig";
import { useNewFlowWizardState } from "../newFlowWizard";

export const InitialConfigSetup = () => {
  const { setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();
  const useFormMethods = useForm<FlowSchemaType>({
    defaultValues: {},
    // resolver: zodResolver(flowSchema),
    shouldUnregister: false,
  });

  const onSubmit = (_data: object) => {
    setFormState((prev) => ({ ...prev, newFlow: { ...generateNewFlowConfig() } }));
    onNext();
  };

  return (
    <form>
      <div>sup</div>
      <WizardNav
        onNext={useFormMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </form>
  );
};
