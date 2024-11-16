import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ButtonGroupField, EntitySearch } from "@/components/Form/formFields";
import { WizardNav } from "@/components/Wizard";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

import { FieldBlockFadeIn } from "../../../components/Form/formLayout/FieldBlockFadeIn";
import {
  FlowGoal,
  IntitialFlowSetupSchemaType,
  NewFlowWizardFormSchema,
  Reusable,
  intitialFlowSetupSchema,
} from "../formValidation";
import { generateNewFlowConfig } from "../generateNewFlowConfig/generateNewFlowConfig";
import { DecisionForm } from "../initialConfigSetup/DecisionForm";
import { PrioritizationForm } from "../initialConfigSetup/PrioritizationForm";
import { SummaryForm } from "../initialConfigSetup/SummaryForm";
import { WebhookForm } from "../initialConfigSetup/WebhookForm";
import { useNewFlowWizardState } from "../newFlowWizard";

export const InitialConfigSetup = () => {
  const { setFormState, onNext, onPrev, nextLabel, formState } = useNewFlowWizardState();
  const { me } = useContext(CurrentUserContext);

  const formMethods = useForm<IntitialFlowSetupSchemaType>({
    defaultValues: formState.initialFlowSetup ?? { permission: { entities: [] } },
    resolver: zodResolver(intitialFlowSetupSchema),
    shouldUnregister: false,
  });

  const onSubmit = (data: IntitialFlowSetupSchemaType) => {
    const newConfig = generateNewFlowConfig({ config: data, creator: me?.user });
    console.log("generated new config", newConfig);

    setFormState(
      (prev): NewFlowWizardFormSchema => ({
        ...prev,
        initialFlowSetup: { ...data },
        new: { ...newConfig },
        // newFlow,
      }),
    );
    onNext();
  };
  // console.log("errors are", formMethods.formState.errors);

  // console.log("form state", formMethods.getValues());
  const goal = formMethods.watch("goal");

  const reusable = formMethods.watch("reusable");

  const isAnyonePermission = (formMethods.watch("permission.anyone") ?? true).toString();

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
            <Typography variant="description">Should this process be reusable?</Typography>
            <ButtonGroupField<IntitialFlowSetupSchemaType>
              label="Test"
              name="reusable"
              options={[
                { name: "No", value: Reusable.NotReusable },
                { name: "Yes", value: Reusable.Reusable },
              ]}
            />
          </FieldBlockFadeIn>
        )}
        {reusable && (
          <FieldBlockFadeIn>
            <Typography variant="description">Who&apos;s participating?</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <ButtonGroupField<IntitialFlowSetupSchemaType>
                label="Test"
                name="permission.anyone"
                options={[
                  { name: "Anyone with the link", value: "true" },
                  { name: "Only certain people", value: "false" },
                ]}
              />
              {isAnyonePermission === "false" && (
                <EntitySearch<IntitialFlowSetupSchemaType>
                  ariaLabel={"Individuals and groups to add to custom group"}
                  name={"permission.entities"}
                  hideCustomGroups={false}
                  label={"Group members *"}
                />
              )}
            </Box>
          </FieldBlockFadeIn>
        )}
        {goal === FlowGoal.TriggerWebhook && isAnyonePermission && <WebhookForm />}
        {goal === FlowGoal.Decision && isAnyonePermission && <DecisionForm />}
        {goal === FlowGoal.Prioritize && isAnyonePermission && <PrioritizationForm />}
        {goal === FlowGoal.AiSummary && isAnyonePermission && <SummaryForm />}
        <WizardNav
          onNext={formMethods.handleSubmit(onSubmit)}
          onPrev={onPrev}
          nextLabel={nextLabel}
        />
      </form>
    </FormProvider>
  );
};
