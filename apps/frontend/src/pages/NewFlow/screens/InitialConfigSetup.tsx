import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { PermissionType } from "@/components/Form/FlowForm/formValidation/permission";
import { ButtonGroupField, EntitySearch } from "@/components/Form/formFields";
import { WizardNav } from "@/components/Wizard";

import { FieldBlockFadeIn } from "../../../components/Form/formLayout/FieldBlockFadeIn";
import { FlowGoal, IntitialFlowSetupSchemaType, intitialFlowSetupSchema } from "../formValidation";
import { generateNewFlowConfig } from "../generateNewFlowConfig/generateNewFlowConfig";
import { DecisionForm } from "../initialConfigSetup/DecisionForm";
import { PrioritizationForm } from "../initialConfigSetup/PrioritizationForm";
import { SummaryForm } from "../initialConfigSetup/SummaryForm";
import { WebhookForm } from "../initialConfigSetup/WebhookForm";
import { useNewFlowWizardState } from "../newFlowWizard";

export const InitialConfigSetup = () => {
  const { setFormState, onNext, onPrev, nextLabel, formState } = useNewFlowWizardState();

  const formMethods = useForm<IntitialFlowSetupSchemaType>({
    defaultValues: formState.initialFlowSetup ?? { permission: { entities: [] } },
    resolver: zodResolver(intitialFlowSetupSchema),
    // shouldUnregister: true,
  });

  const onSubmit = (data: IntitialFlowSetupSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      initialFlowSetup: { ...data },
      newFlow: { ...generateNewFlowConfig({ config: data }) },
    }));
    onNext();
  };
  // console.log("errors are", formMethods.formState.errors);

  // console.log("form state", formMethods.getValues());
  const goal = formMethods.watch("goal");

  const permissionType = formMethods.watch("permission.type");

  return (
    <FormProvider {...formMethods}>
      <form
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "30px",
        }}
      >
        <FieldBlockFadeIn>
          <Typography variant="description">
            What&apos;s the goal of this collaborative process?
          </Typography>
          <ButtonGroupField<IntitialFlowSetupSchemaType>
            label="Test"
            name="goal"
            options={[
              { name: "Decide", value: FlowGoal.Decision },
              { name: "Prioritize", value: FlowGoal.Prioritize },
              { name: "Summarize ideas", value: FlowGoal.AiSummary },
              {
                name: "Trigger another tool",
                value: FlowGoal.TriggerWebhook,
              },
            ]}
          />
        </FieldBlockFadeIn>
        {goal && (
          <FieldBlockFadeIn>
            <Typography variant="description">Who&apos;s participating?</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <ButtonGroupField<IntitialFlowSetupSchemaType>
                label="Test"
                name="permission.type"
                options={[
                  { name: "Anyone with the link", value: PermissionType.Anyone },
                  { name: "Only certain people", value: PermissionType.Entities },
                ]}
              />
              {permissionType === PermissionType.Entities && (
                <EntitySearch<IntitialFlowSetupSchemaType>
                  ariaLabel={"Individuals and groups to add to custom group"}
                  control={formMethods.control}
                  name={"permission.entities"}
                  hideCustomGroups={true}
                  label={"Group members *"}
                  setFieldValue={formMethods.setValue}
                  getFieldValues={formMethods.getValues}
                />
              )}
            </Box>
          </FieldBlockFadeIn>
        )}
        {goal === FlowGoal.TriggerWebhook && permissionType && <WebhookForm />}
        {goal === FlowGoal.Decision && permissionType && <DecisionForm />}
        {goal === FlowGoal.Prioritize && permissionType && <PrioritizationForm />}
        {goal === FlowGoal.AiSummary && permissionType && <SummaryForm />}
        <WizardNav
          onNext={formMethods.handleSubmit(onSubmit)}
          onPrev={onPrev}
          nextLabel={nextLabel}
        />
      </form>
    </FormProvider>
  );
};
