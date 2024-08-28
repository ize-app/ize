import { zodResolver } from "@hookform/resolvers/zod";
import { Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { WebhookForm } from "@/components/Form/FlowForm/components/ActionForm/WebhookForm";
import { PermissionForm } from "@/components/Form/FlowForm/components/PermissionForm";
import { Select, TextField } from "@/components/Form/formFields";
import { WizardNav } from "@/components/Wizard";

import {
  ActionTriggerCondition,
  FlowGoal,
  IntitialFlowSetupSchemaType,
  intitialFlowSetupSchema,
} from "../formValidation";
import { generateNewFlowConfig } from "../generateNewFlowConfig";
import { useNewFlowWizardState } from "../newFlowWizard";

export const InitialConfigSetup = () => {
  const { setFormState, onNext, onPrev, nextLabel, formState } = useNewFlowWizardState();

  // console.log("formState", formState);

  const formMethods = useForm<IntitialFlowSetupSchemaType>({
    defaultValues: formState.initialFlowSetup ?? {},
    resolver: zodResolver(intitialFlowSetupSchema),
    // shouldUnregister: true,
  });

  const onSubmit = (data: IntitialFlowSetupSchemaType) => {
    setFormState((prev) => ({
      ...prev,
      initialFlowSetup: { ...data },
      newFlow: { ...generateNewFlowConfig() },
    }));
    onNext();
  };

  console.log("form state", formMethods.getValues());
  const goal = formMethods.watch("goal");
  const validWebhook = formMethods.watch("webhook.callWebhook.valid");

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
        <Typography variant="description">
          What&apos;s the goal of this collaborative process?
        </Typography>
        <Select<IntitialFlowSetupSchemaType>
          control={formMethods.control}
          label="What's the goal of this collaborative process?"
          selectOptions={[
            {
              name: "Trigger action in another tool",
              value: FlowGoal.TriggerWebhook,
            },
            { name: "Make a decision", value: FlowGoal.Decision },
            { name: "Prioritize options", value: FlowGoal.Prioritize },
            { name: "Sythnthesize group perspectives with AI", value: FlowGoal.AiSummary },
          ]}
          name={`goal`}
          size="small"
        />
        {goal === FlowGoal.TriggerWebhook && (
          <>
            <Typography variant="description">Let&apos;s set up how this webhook works</Typography>
            <WebhookForm<IntitialFlowSetupSchemaType> fieldName={`webhook`} />
            {validWebhook && (
              <>
                <Typography variant="description">Who should be involved?</Typography>
                <PermissionForm<IntitialFlowSetupSchemaType>
                  fieldName={`permission`}
                  branch="response"
                />
              </>
            )}
            <Typography variant="description">When should this action happen?</Typography>
            <Select<IntitialFlowSetupSchemaType>
              control={formMethods.control}
              label="When should this action get triggered?"
              selectOptions={[
                {
                  name: "Whenever someone triggers this flow",
                  value: ActionTriggerCondition.None,
                },
                {
                  name: "Only if there's a certain decision",
                  value: ActionTriggerCondition.Decision,
                },
              ]}
              name={`webhookTriggerCondition`}
              size="small"
            />
          </>
        )}
        {goal === FlowGoal.Decision && (
          <>
            <Typography variant="description">Ok, let&apos;s set up the decision</Typography>
            <TextField<IntitialFlowSetupSchemaType>
              // assuming here that results to fields is 1:1 relationshp
              name={`decision.name`}
              control={formMethods.control}
              multiline
              placeholderText={"What are you deciding on"}
              label={``}
              defaultValue=""
            />
            <Select<IntitialFlowSetupSchemaType>
              control={formMethods.control}
              label="What are you deciding between"
              selectOptions={[
                {
                  name: "Whenever someone triggers this flow",
                  value: ActionTriggerCondition.None,
                },
                {
                  name: "Only if there's a certain decision",
                  value: ActionTriggerCondition.Decision,
                },
              ]}
              name={`webhookTriggerCondition`}
              size="small"
            />
          </>
        )}

        <WizardNav
          onNext={formMethods.handleSubmit(onSubmit)}
          onPrev={onPrev}
          nextLabel={nextLabel}
        />
      </form>
    </FormProvider>
  );
};
