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
import { useContext, useState } from "react";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";
import { Typography } from "@mui/material";
import { TriggerForm } from "../components/TriggerForm";
import { StepForm } from "../components/StepForm";
import { StageConnectorButton } from "../../../ConfigDiagram/DiagramPanel/StageConnectorButton";
import { WebhookForm } from "../components/WebhookForm";
import { EvolveFlowForm } from "../components/EvolveFlowForm";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";

import {
  FlowConfigDiagramContainer,
  PanelHeader,
  ConfigurationPanel,
  DiagramPanel,
  AddStageButton,
  PanelContainer,
  FlowStage,
} from "@/components/ConfigDiagram";

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
      <FlowConfigDiagramContainer>
        {/* Flow diagram*/}
        <PanelContainer>
          <PanelHeader>
            <StreamlinedTextField
              control={useFormMethods.control}
              sx={{ width: "100%" }}
              label="Name of this flow"
              placeholderText="Name of this flow"
              size="small"
              name={`name`}
            />
          </PanelHeader>
          <DiagramPanel>
            <FlowStage
              label="Trigger"
              key="trigger0"
              id={"trigger0"}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              hasError={!!useFormMethods.formState.errors.steps?.[0]?.request}
              icon={PlayCircleOutlineOutlinedIcon}
            />
            <StageConnectorButton />
            {stepsArrayMethods.fields.map((item, index) => {
              return (
                <Box key={item.id}>
                  <FlowStage
                    icon={Diversity3OutlinedIcon}
                    label={"Collaboration " + (index + 1).toString()}
                    key={"stage-" + item.id.toString() + index.toString()}
                    deleteHandler={
                      index > 0
                        ? () => {
                            stepsArrayMethods.remove(index);
                          }
                        : undefined
                    }
                    hasError={!!useFormMethods.formState.errors.steps?.[index]}
                    id={"step" + index.toString()}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                  />
                  <StageConnectorButton
                    key={"connector-" + item.id.toString() + index.toString()}
                  />
                </Box>
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
                <AddStageButton
                  label={"Add collaborative step"}
                  onClick={() => {
                    stepsArrayMethods.append(defaultStepFormValues);
                    // navigate to newly created step
                    setSelectedId(`step${stepsArrayMethods.fields.length}`);
                  }}
                />
                <AddStageButton
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
              <FlowStage
                label="Webhook"
                id={"webhook"}
                setSelectedId={setSelectedId}
                selectedId={selectedId}
                deleteHandler={() => {
                  console.log("deleting webhook");
                  setSelectedId("trigger0");
                  useFormMethods.setValue(
                    `steps.${stepsArrayMethods.fields.length - 1}.action`,
                    undefined,
                  );
                }}
                icon={PublicOutlinedIcon}
                hasError={
                  !!useFormMethods.formState.errors.steps?.[stepsArrayMethods.fields.length - 1]
                    ?.action
                }
              />
            )}
            <FlowStage
              label={"Flow evolution"}
              key={"evolve"}
              hasError={!!useFormMethods.formState.errors.evolve}
              id={"evolve"}
              icon={ChangeCircleOutlinedIcon}
              setSelectedId={setSelectedId}
              selectedId={selectedId}
              sx={{ marginTop: "48px", backgroundColor: "#f9f0fc" }} //#f7f7d7
            />
          </DiagramPanel>
        </PanelContainer>
        {/* Configuration panel*/}
        <PanelContainer>
          <PanelHeader>
            <Typography color="primary" variant="label">
              Configuration
            </Typography>
          </PanelHeader>
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
                  formMethods={useFormMethods}
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
        </PanelContainer>
      </FlowConfigDiagramContainer>
      <WizardNav
        onNext={useFormMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </form>
  );
};
