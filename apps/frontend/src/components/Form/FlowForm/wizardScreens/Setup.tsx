import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import { useFieldArray, useForm } from "react-hook-form";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";
import { FlowSchemaType } from "../formValidation/flow";

import { WizardNav } from "@/components/Wizard";
import { flowSchema } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";
import { TextField } from "../../formFields";
import { EntityType, DecisionType, ActionType } from "@/graphql/generated/graphql";
import { useContext, useState } from "react";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";
import { Button, Paper } from "@mui/material";
import { StageContainer } from "../components/StageContainer";
import { RequestForm } from "../components/RequestForm";
import { StepForm } from "../components/StepForm";
import { StageConnectorButton } from "../components/StageConnectorButton";
import { WebhookForm } from "../components/WebhookForm";
import { EvolveFlowForm } from "../components/EvolveFlowForm";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();
  const [expandedNew, setExpandedNew] = useState<string | false>("trigger0"); // change to step1

  const fieldArrayName = "steps";

  const { me } = useContext(CurrentUserContext);

  const useFormMethods = useForm<FlowSchemaType>({
    defaultValues: {
      name: formState.name ?? "",
      evolve: formState.evolve ?? {
        requestPermission: { type: PermissionType.Anyone, entities: [] },
        responsePermission: {
          type: PermissionType.Entities,
          entities: me?.identities
            ? [
                // This would be an issue if there was ever not any other id but the discord id
                // but each discord auth also creates email identity
                // TODO: brittle, should handle better
                me.identities
                  .filter((id) => id.identityType.__typename !== "IdentityDiscord")
                  .map((id) => ({ ...id, __typename: "Identity" as EntityType }))[0],
              ]
            : [],
        },
        decision: {
          type: DecisionType.NumberThreshold,
          threshold: 1,
        },
      },
      steps: formState.steps ? [...formState.steps] : [defaultStepFormValues],
    },
    resolver: zodResolver(flowSchema),
    shouldUnregister: true,
  });

  const hasWebhook = useFormMethods.watch("steps.0.action.type") === ActionType.CallWebhook;

  console.log("form state is ", useFormMethods.getValues());
  console.log("errors are ", useFormMethods.formState.errors);

  const stepsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    name: fieldArrayName,
  });

  const onSubmit = (data: FlowSchemaType) => {
    setFormState((prev) => ({ ...prev, ...data }));
    onNext();
  };

  return (
    <form style={{ height: "90%" }}>
      {/* <WizardBody> */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "horizontal",
          height: "100%",
          gap: "36px",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            // gap: "24px",
            maxWidth: "1200px",
            width: "50%",
          }}
        >
          <TextField<FlowSchemaType>
            control={useFormMethods.control}
            sx={{ width: "100%" }}
            label="Name of this flow"
            placeholderText="What's the purpose of this form?"
            variant="outlined"
            size="small"
            showLabel={true}
            name={`name`}
          />
          <StageContainer
            label="Trigger"
            onClick={() => {
              setExpandedNew("trigger");
            }}
            hasError={!!useFormMethods.formState.errors.steps?.[0]?.request}
          />
          <StageConnectorButton />
          {stepsArrayMethods.fields.map((item, index) => {
            return (
              <>
                <StageContainer
                  label={"Collaboration " + (index + 1).toString()}
                  key={"stage-" + item.id}
                  hasError={
                    !!useFormMethods.formState.errors.steps?.[index]?.response ||
                    !!useFormMethods.formState.errors.steps?.[index]?.result ||
                    !!useFormMethods.formState.errors.steps?.[index]?.allowMultipleResponses ||
                    !!useFormMethods.formState.errors.steps?.[index]?.expirationSeconds
                  }
                  onClick={() => {
                    setExpandedNew("step" + index.toString());
                  }}
                />
                <StageConnectorButton />
              </>
            );
          })}

          {!hasWebhook ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "16px",
                flexWrap: "wrap",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                marginTop: "8px",
                marginBottom: "16px",
              }}
            >
              <Button
                variant="outlined"
                size="medium"
                color="secondary"
                sx={{ border: "3px dashed", width: "200px" }}
                onClick={() => {
                  stepsArrayMethods.append(defaultStepFormValues);
                }}
              >
                Add collaborative step
              </Button>
              <Button
                variant="outlined"
                size="medium"
                color="secondary"
                sx={{ border: "3px dashed", width: "200px" }}
                onClick={() => {
                  //@ts-ignore
                  useFormMethods.setValue(`steps.${stepsArrayMethods.fields.length - 1}.action`, {
                    type: ActionType.CallWebhook,
                  });
                  setExpandedNew("webhook");
                }}
              >
                Trigger webhook
              </Button>
            </Box>
          ) : (
            <StageContainer
              label="Webhook"
              onClick={() => {
                setExpandedNew("webhook");
              }}
              hasError={
                !!useFormMethods.formState.errors.steps?.[stepsArrayMethods.fields.length - 1]
                  ?.action
              }
            />
          )}
          <StageContainer
            label={"How this flow evolves"}
            key={"evolve"}
            hasError={!!useFormMethods.formState.errors.evolve}
            onClick={() => {
              setExpandedNew("evolve");
            }}
            sx={{ marginTop: "60px" }}
          />
        </Box>
        <Paper elevation={3} sx={{ width: "50%", backgroundColor: "white" }}>
          <RequestForm
            formMethods={useFormMethods}
            formIndex={0}
            show={expandedNew === "trigger"}
          />
          {stepsArrayMethods.fields.map((item, index) => {
            return (
              <StepForm
                // id={item.id}
                useFormMethods={useFormMethods}
                formIndex={index}
                key={"step-" + item.id}
                show={expandedNew === "step" + index.toString()}
              />
            );
          })}
          {hasWebhook && (
            <WebhookForm
              formMethods={useFormMethods}
              formIndex={stepsArrayMethods.fields.length - 1}
              show={expandedNew === "webhook"}
            />
          )}
          <EvolveFlowForm formMethods={useFormMethods} show={expandedNew === "evolve"} />
        </Paper>
      </Box>
      {/* </WizardBody> */}
      <WizardNav
        onNext={useFormMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </form>
  );
};
