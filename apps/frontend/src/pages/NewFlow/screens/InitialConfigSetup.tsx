import { useForm } from "react-hook-form";

import { FlowSchemaType } from "@/components/Form/FlowForm/formValidation/flow";
import { WizardNav } from "@/components/Wizard";

import { useNewFlowWizardState } from "../newFlowWizard";

export const InitialConfigSetup = () => {
  const { setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();
  const useFormMethods = useForm<FlowSchemaType>({
    defaultValues: {},
    // resolver: zodResolver(flowSchema),
    shouldUnregister: false,
  });

  const onSubmit = (data: object) => {
    setFormState((prev) => ({ ...prev, ...data }));
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
