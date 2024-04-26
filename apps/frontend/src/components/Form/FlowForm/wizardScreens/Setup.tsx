import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import { useFieldArray, useForm } from "react-hook-form";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";
import { FlowSchemaType } from "../formValidation/flow";

import { WizardNav } from "@/components/Wizard";
import { flowSchema } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";
import { StreamlinedTextField } from "../../formFields";
import { EntityType, DecisionType, ActionType } from "@/graphql/generated/graphql";
import React, { useContext, useState } from "react";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";
import { Button, Typography } from "@mui/material";
import { StageContainer } from "../components/StageContainer";
import { TriggerForm } from "../components/TriggerForm";
import { StepForm } from "../components/StepForm";
import { StageConnectorButton } from "../components/StageConnectorButton";
import { WebhookForm } from "../components/WebhookForm";
import { EvolveFlowForm } from "../components/EvolveFlowForm";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

const StageHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: "40px",
        display: "flex",
        alignItems: "center",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        padding: "1rem",
      }}
    >
      {children}
    </Box>
  );
};

const ConfigurationPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        height: "100%",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        backgroundColor: "white",
        // padding: "1rem",
      }}
    >
      {children}
    </Box>
  );
};

const DiagramPanel = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      sx={{
        height: "100%",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        padding: "48px 0px",
        alignItems: "center",
      }}
    >
      {children}
    </Box>
  );
};

const AddButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
  <Button
    variant="outlined"
    size="medium"
    color="secondary"
    sx={{
      width: "240px",
      border: "2px dashed",
      "&&:hover": {
        border: "2px dashed",
      },
    }}
    onClick={onClick}
  >
    {label}
  </Button>
);
export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();
  const [selectedId, setSelectedId] = useState<string | false>("trigger0"); // change to step1

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
    <form style={{ height: "100%" }}>
      <Box
        sx={(theme) => ({
          display: "flex",
          [theme.breakpoints.down("md")]: {
            flexDirection: "column",
          },
          flexDirection: "row",
          width: "100%",
          height: "100%",
        })}
      >
        {/* Flow diagram*/}
        <Box
          sx={(theme) => ({
            [theme.breakpoints.down("md")]: {
              flexGrow: 0,
            },
            flexGrow: 1,
            display: "flex",
            minWidth: "300px",
            flexDirection: "column",
          })}
        >
          <StageHeader>
            <StreamlinedTextField
              control={useFormMethods.control}
              sx={{ width: "100%" }}
              label="Name of this flow"
              placeholderText="Name of this flow"
              size="small"
              name={`name`}
            />
          </StageHeader>
          <DiagramPanel>
            <StageContainer
              label="Trigger"
              id={"trigger0"}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              hasError={!!useFormMethods.formState.errors.steps?.[0]?.request}
              icon={<PlayCircleOutlineOutlinedIcon color="primary" />}
            />
            <StageConnectorButton />
            {stepsArrayMethods.fields.map((item, index) => {
              return (
                <>
                  <StageContainer
                    icon={<Diversity3OutlinedIcon color="primary" />}
                    label={"Collaboration " + (index + 1).toString()}
                    key={"stage-" + item.id}
                    hasError={
                      !!useFormMethods.formState.errors.steps?.[index]?.response ||
                      !!useFormMethods.formState.errors.steps?.[index]?.result ||
                      !!useFormMethods.formState.errors.steps?.[index]?.allowMultipleResponses ||
                      !!useFormMethods.formState.errors.steps?.[index]?.expirationSeconds
                    }
                    id={"step" + index.toString()}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                  />
                  <StageConnectorButton />
                </>
              );
            })}
            {!hasWebhook ? (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  flexWrap: "wrap",
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: "8px",
                  marginBottom: "16px",
                }}
              >
                <AddButton
                  label={"Add collaborative step"}
                  onClick={() => {
                    stepsArrayMethods.append(defaultStepFormValues);
                  }}
                />
                <AddButton
                  label={"Trigger webhook"}
                  onClick={() => {
                    //@ts-ignore
                    useFormMethods.setValue(`steps.${stepsArrayMethods.fields.length - 1}.action`, {
                      type: ActionType.CallWebhook,
                    });
                    setSelectedId("webhook");
                  }}
                />
              </Box>
            ) : (
              <StageContainer
                label="Webhook"
                id={"webhook"}
                setSelectedId={setSelectedId}
                selectedId={selectedId}
                icon={<PublicOutlinedIcon color="primary" />}
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
              id={"evolve"}
              icon={<ChangeCircleOutlinedIcon color="primary" />}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              sx={{ marginTop: "48px", backgroundColor: "#f9f0fc" }} //#f7f7d7
            />
          </DiagramPanel>
        </Box>
        {/* Configuration panel*/}
        <Box sx={{ minWidth: "300px", flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <StageHeader>
            <Typography color="primary" variant="label">
              Configuration
            </Typography>
          </StageHeader>
          <ConfigurationPanel>
            <TriggerForm
              formMethods={useFormMethods}
              formIndex={0}
              show={selectedId === "trigger0"}
            />
            {stepsArrayMethods.fields.map((item, index) => {
              return (
                <StepForm
                  // id={item.id}
                  useFormMethods={useFormMethods}
                  formIndex={index}
                  key={"step-" + item.id}
                  show={selectedId === "step" + index.toString()}
                />
              );
            })}
            {hasWebhook && (
              <WebhookForm
                formMethods={useFormMethods}
                formIndex={stepsArrayMethods.fields.length - 1}
                show={selectedId === "webhook"}
              />
            )}
            <EvolveFlowForm formMethods={useFormMethods} show={selectedId === "evolve"} />
          </ConfigurationPanel>
        </Box>
      </Box>
      <WizardNav
        onNext={useFormMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </form>
  );
};
