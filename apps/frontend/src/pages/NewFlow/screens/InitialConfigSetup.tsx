import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Fade, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";

import { WebhookForm } from "@/components/Form/FlowForm/components/ActionForm/WebhookForm";
import { PermissionType } from "@/components/Form/FlowForm/formValidation/permission";
import { EntitySearch, TextField } from "@/components/Form/formFields";
import { WizardNav } from "@/components/Wizard";

// import ButtonGroup from "../ButtonGroup";
import { ButtonGroupField } from "../ButtonGroupField";
import {
  AIOutputType,
  ActionTriggerCondition,
  FlowGoal,
  IntitialFlowSetupSchemaType,
  OptionsType,
  intitialFlowSetupSchema,
} from "../formValidation";
import { generateNewFlowConfig } from "../generateNewFlowConfig";
import { useNewFlowWizardState } from "../newFlowWizard";

const FieldBlock = ({ children }: { children: React.ReactNode }) => {
  return (
    <Fade in={true} timeout={1000}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>{children}</Box>
    </Fade>
  );
};

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
  const question = formMethods.watch("question");
  const webhookTriggerCondition = formMethods.watch("webhookTriggerCondition");
  // const validWebhook = formMethods.watch("webhook.callWebhook.valid");
  const aiOutputType = formMethods.watch("aiOutputType");
  const permissionType = formMethods.watch("permission.type");
  const decisionName = formMethods.watch("decision.name");

  return (
    <FormProvider {...formMethods}>
      <form
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
        }}
      >
        <FieldBlock>
          <Typography variant="description">
            What&apos;s the goal of this collaborative process?
          </Typography>
          <ButtonGroupField
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
        </FieldBlock>
        {goal && (
          <FieldBlock>
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
          </FieldBlock>
        )}
        {goal === FlowGoal.TriggerWebhook && permissionType && (
          <>
            <FieldBlock>
              <Typography variant="description">When should this action happen?</Typography>
              <ButtonGroupField<IntitialFlowSetupSchemaType>
                label="Test"
                name={`webhookTriggerCondition`}
                options={[
                  {
                    name: "Whenever someone triggers this flow",
                    value: ActionTriggerCondition.None,
                  },
                  {
                    name: "Only if there's a certain decision",
                    value: ActionTriggerCondition.Decision,
                  },
                ]}
              />
            </FieldBlock>
            {webhookTriggerCondition && permissionType && (
              <FieldBlock>
                <Typography variant="description">
                  Let&apos;s set up how this webhook works
                </Typography>

                <WebhookForm<IntitialFlowSetupSchemaType> fieldName={`webhook`} />
              </FieldBlock>
            )}
          </>
        )}
        {(goal === FlowGoal.Decision ||
          webhookTriggerCondition == ActionTriggerCondition.Decision) &&
          permissionType && (
            <>
              <FieldBlock>
                <Typography variant="description">What are you deciding on?</Typography>
                <TextField<IntitialFlowSetupSchemaType>
                  // assuming here that results to fields is 1:1 relationshp
                  name={`decision.name`}
                  control={formMethods.control}
                  multiline
                  placeholderText={"What are you deciding on"}
                  label={``}
                  defaultValue=""
                />
              </FieldBlock>
              {decisionName && (
                <FieldBlock>
                  <Typography variant="description">
                    What options are you deciding between?
                  </Typography>
                  <ButtonGroupField<IntitialFlowSetupSchemaType>
                    label="Test"
                    name={`decision.optionsType`}
                    options={[
                      {
                        name: "Preset options",
                        value: OptionsType.Preset,
                      },
                      {
                        name: "Options created when triggered",
                        value: OptionsType.Trigger,
                      },
                      {
                        name: "Ask community for option ideas",
                        value: OptionsType.PrevStep,
                      },
                    ]}
                  />
                </FieldBlock>
              )}
            </>
          )}
        {goal === FlowGoal.AiSummary && (
          <>
            <FieldBlock>
              <Typography variant="description">What&apos;s your question to the group?</Typography>
              <TextField<IntitialFlowSetupSchemaType>
                // assuming here that results to fields is 1:1 relationshp
                name={`question`}
                control={formMethods.control}
                multiline
                placeholderText={"What's your question to the group?"}
                label={``}
                defaultValue=""
              />
            </FieldBlock>
            {question && (
              <FieldBlock>
                <Typography variant="description">
                  What kind of output do you want from the AI
                </Typography>
                <ButtonGroupField<IntitialFlowSetupSchemaType>
                  label="Test"
                  name={`aiOutputType`}
                  options={[
                    {
                      name: "Single summary",
                      value: AIOutputType.Summary,
                    },
                    {
                      name: "List of outputs",
                      value: AIOutputType.List,
                    },
                  ]}
                />
              </FieldBlock>
            )}
            {aiOutputType && (
              <>
                <FieldBlock>
                  <Typography variant="description">
                    What kind of output do you want from the AI
                  </Typography>
                  <TextField<IntitialFlowSetupSchemaType>
                    // assuming here that results to fields is 1:1 relationshp
                    name={`prompt`}
                    control={formMethods.control}
                    multiline
                    placeholderText={"Prompt for the AI"}
                    label={``}
                    defaultValue=""
                  />
                  <TextField<IntitialFlowSetupSchemaType>
                    // assuming here that results to fields is 1:1 relationshp
                    name={`example`}
                    control={formMethods.control}
                    multiline
                    placeholderText={"example output from the AI"}
                    label={``}
                    defaultValue=""
                  />
                </FieldBlock>
              </>
            )}
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
