import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

import { PermissionForm } from "@/components/Form/FlowForm/components/PermissionForm";
import { Select } from "@/components/Form/formFields";
import { WizardNav } from "@/components/Wizard";

import { FlowGoal, IntitialFlowSetupSchemaType, intitialFlowSetupSchema } from "../formValidation";
import { generateNewFlowConfig } from "../generateNewFlowConfig";
import { useNewFlowWizardState } from "../newFlowWizard";

export const InitialConfigSetup = () => {
  const { setFormState, onNext, onPrev, nextLabel, formState } = useNewFlowWizardState();

  // console.log("formState", formState);

  const formMethods = useForm<IntitialFlowSetupSchemaType>({
    defaultValues: formState.initialFlowSetup ?? {},
    resolver: zodResolver(intitialFlowSetupSchema),
    shouldUnregister: false,
  });

  const onSubmit = (data: IntitialFlowSetupSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      initialFlowSetup: { ...data },
      newFlow: { ...generateNewFlowConfig() },
    }));
    onNext();
  };

  return (
    <FormProvider {...formMethods}>
      <form
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Select<IntitialFlowSetupSchemaType>
          control={formMethods.control}
          label="What's the final result?"
          selectOptions={[
            {
              name: "Allow community to trigger action in another tool",
              value: FlowGoal.TriggerAction,
            },
            { name: "Make a decision", value: FlowGoal.Decision },
            { name: "Prioritize options", value: FlowGoal.Prioritize },
            { name: "Sythnthesize group perspectives with AI", value: FlowGoal.AiSummary },
          ]}
          name={`goal`}
          size="small"
        />
        <PermissionForm<IntitialFlowSetupSchemaType> fieldName={`permission`} branch="response" />
        <WizardNav
          onNext={formMethods.handleSubmit(onSubmit)}
          onPrev={onPrev}
          nextLabel={nextLabel}
        />
      </form>
    </FormProvider>
  );
};
