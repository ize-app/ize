import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Typography } from "@mui/material";
import { useContext } from "react";
import { FormProvider, useForm } from "react-hook-form";

import { ButtonGroupField, EntitySearch } from "@/components/Form/formFields";
import { WizardNav } from "@/components/Wizard";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { Route } from "@/routers/routes";

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
import { GetPerspectivesForm } from "../initialConfigSetup/GetPerspectivesForm";
import { PrioritizationForm } from "../initialConfigSetup/PrioritizationForm";
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
          maxWidth: "800px",
          gap: "30px",
          marginBottom: "48px",
        }}
      >
        <Typography variant="description">
          Flows define and automate collaborative processes that span tools,
          teams, and time.{" "}
          <a href={Route.About} target="_blank" rel="noopener noreferrer">
            Learn more
          </a>
        </Typography>
        <FieldBlockFadeIn>
          <Typography variant="description">What&apos;s the goal of this flow?</Typography>
          <ButtonGroupField<IntitialFlowSetupSchemaType>
            label="Test"
            name="goal"
            options={[
              { name: "Decide", value: FlowGoal.Decision },
              { name: "Prioritize", value: FlowGoal.Prioritize },
              { name: "Get perspectives", value: FlowGoal.GetPerspectives },
              {
                name: "Trigger another tool",
                value: FlowGoal.TriggerWebhook,
              },
            ]}
          />
        </FieldBlockFadeIn>
        {goal && (
          <FieldBlockFadeIn>
            <Typography variant="description">Should this flow be a reusable template?</Typography>
            <ButtonGroupField<IntitialFlowSetupSchemaType>
              label="Test"
              name="reusable"
              options={[
                { name: "No, just execute the flow immediately", value: Reusable.NotReusable },
                { name: "Yes, make it a reusable template", value: Reusable.Reusable },
              ]}
            />
          </FieldBlockFadeIn>
        )}
        {reusable && (
          <FieldBlockFadeIn>
            <Typography variant="description">Who can participate?</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <ButtonGroupField<IntitialFlowSetupSchemaType>
                label="Test"
                name="permission.anyone"
                options={[
                  { name: "Anyone", value: "true" },
                  { name: "Only certain people", value: "false" },
                ]}
              />
              {isAnyonePermission === "false" && (
                <EntitySearch<IntitialFlowSetupSchemaType>
                  required={true}
                  ariaLabel={"Individuals and groups to add to custom group"}
                  name={"permission.entities"}
                  hideIzeGroups={false}
                  label={"Group members *"}
                />
              )}
            </Box>
          </FieldBlockFadeIn>
        )}
        {goal === FlowGoal.TriggerWebhook && isAnyonePermission && <WebhookForm />}
        {goal === FlowGoal.Decision && isAnyonePermission && <DecisionForm />}
        {goal === FlowGoal.Prioritize && isAnyonePermission && <PrioritizationForm />}
        {goal === FlowGoal.GetPerspectives && isAnyonePermission && <GetPerspectivesForm />}
        <WizardNav
          onNext={formMethods.handleSubmit(onSubmit)}
          onPrev={onPrev}
          nextLabel={nextLabel}
        />
      </form>
    </FormProvider>
  );
};
