import { zodResolver } from "@hookform/resolvers/zod";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

import { actionProperties } from "@/components/Action/actionProperties";
import {
  AddStageButton,
  ConfigurationPanel,
  DiagramPanel,
  FlowConfigDiagramContainer,
  FlowStage,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { WizardNav } from "@/components/Wizard";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { ActionType, DecisionType, EntityType } from "@/graphql/generated/graphql";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";

import { StageConnectorButton } from "../../../ConfigDiagram/DiagramPanel/StageConnectorButton";
import { StreamlinedTextField } from "../../formFields";
import { EvolveFlowForm } from "../components/EvolveFlowForm";
import { StepForm } from "../components/StepForm";
import { TriggerForm } from "../components/TriggerForm";
import { WebhookForm } from "../components/WebhookForm";
import { DefaultOptionSelection } from "../formValidation/fields";
import { FlowSchemaType, flowSchema } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";

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

  // console.log("form state is ", useFormMethods.getValues());
  // console.log("errors are ", useFormMethods.formState.errors);

  const hasStep0Response = !!useFormMethods.watch(`steps.0.response`);

  const stepsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    name: fieldArrayName,
  });

  const onSubmit = (data: FlowSchemaType) => {
    setFormState((prev) => ({ ...prev, ...data }));
    onNext();
  };

  const hasWebhook =
    useFormMethods.watch(`steps.${stepsArrayMethods.fields.length - 1}.action.type`) ===
    ActionType.CallWebhook;

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
                (index > 0 || hasStep0Response) && (
                  <Box key={item.id}>
                    <FlowStage
                      icon={Diversity3OutlinedIcon}
                      label={"Collaboration " + (index + 1).toString()}
                      key={"stage-" + item.id.toString() + index.toString()}
                      deleteHandler={
                        index > 0
                          ? () => {
                              stepsArrayMethods.remove(index);
                              setSelectedId("trigger0");
                            }
                          : () => {
                              console.log(`deleting step ${index} response`);
                              useFormMethods.setValue(`steps.${index}.response`, undefined);
                              setSelectedId("trigger0");
                            }
                      }
                      hasError={
                        !!useFormMethods.formState.errors.steps?.[index]?.root ||
                        !!useFormMethods.formState.errors.steps?.[index]?.response ||
                        !!useFormMethods.formState.errors.steps?.[index]?.expirationSeconds ||
                        !!useFormMethods.formState.errors.steps?.[index]?.allowMultipleResponses
                      }
                      id={"step" + index.toString()}
                      setSelectedId={setSelectedId}
                      selectedId={selectedId}
                    />
                    <StageConnectorButton
                      key={"connector-" + item.id.toString() + index.toString()}
                    />
                  </Box>
                )
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
                    if (stepsArrayMethods.fields.length === 1 && !hasStep0Response) {
                      useFormMethods.setValue(
                        `steps.${0}.response`,
                        defaultStepFormValues.response,
                      );
                    } else {
                      const secondToLastIndex = stepsArrayMethods.fields.length - 1;
                      stepsArrayMethods.append(defaultStepFormValues);
                      useFormMethods.setValue(`steps.${secondToLastIndex}.action`, {
                        filterOptionId: DefaultOptionSelection.None,
                        type: ActionType.TriggerStep,
                      });
                      // navigate to newly created step
                      setSelectedId(`step${stepsArrayMethods.fields.length}`);
                    }
                  }}
                />
                <AddStageButton
                  label={"Trigger webhook"}
                  onClick={() => {
                    //@ts-expect-error TODO
                    useFormMethods.setValue(`steps.${stepsArrayMethods.fields.length - 1}.action`, {
                      filterOptionId: DefaultOptionSelection.None,
                      type: ActionType.CallWebhook,
                    });
                    setSelectedId("webhook");
                  }}
                />
              </Box>
            ) : (
              <FlowStage
                label={actionProperties[ActionType.CallWebhook].label}
                id={"webhook"}
                icon={actionProperties[ActionType.CallWebhook].icon}
                setSelectedId={setSelectedId}
                selectedId={selectedId}
                deleteHandler={() => {
                  setSelectedId("trigger0");
                  useFormMethods.setValue(
                    `steps.${stepsArrayMethods.fields.length - 1}.action`,
                    undefined,
                  );
                }}
                sx={{ marginBottom: "16px" }}
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
              icon={actionProperties[ActionType.EvolveFlow].icon}
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
              if (stepsArrayMethods.fields.length === 1 && !hasStep0Response) return null;
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
