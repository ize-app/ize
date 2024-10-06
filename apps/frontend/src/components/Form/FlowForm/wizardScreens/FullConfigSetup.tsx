import { zodResolver } from "@hookform/resolvers/zod";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { useContext, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

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
import { ActionType, DecisionType, EntityType } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";

import { StageConnectorButton } from "../../../ConfigDiagram/DiagramPanel/StageConnectorButton";
import { StreamlinedTextField } from "../../formFields";
import { ActionForm } from "../components/ActionForm/ActionForm";
import { EvolveFlowForm } from "../components/EvolveFlowForm";
import { StepForm } from "../components/StepForm";
import { TriggerForm } from "../components/TriggerForm";
import { DefaultOptionSelection } from "../formValidation/fields";
import { FlowSchemaType, flowSchema } from "../formValidation/flow";
import { PermissionType } from "../formValidation/permission";
import { defaultStepFormValues } from "../helpers/getDefaultFormValues";

export const FullConfigSetup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();
  const [selectedId, setSelectedId] = useState<string | false>("trigger0"); // change to step1

  const fieldArrayName = "steps";

  const { me } = useContext(CurrentUserContext);

  const useFormMethods = useForm<FlowSchemaType>({
    defaultValues: {
      name: formState.newFlow?.name ?? "",
      evolve: formState.newFlow?.evolve ?? {
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
      steps: formState.newFlow?.steps ? [...formState.newFlow.steps] : [defaultStepFormValues],
    },
    resolver: zodResolver(flowSchema),
    shouldUnregister: false,
  });

  // console.log("errors are ", useFormMethods.formState.errors);
  // console.log("values are ", useFormMethods.getValues());

  const hasStep0Response =  !!useFormMethods.getValues(`steps.0.response`);

  const stepsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    name: fieldArrayName,
  });

  const onSubmit = (data: FlowSchemaType) => {
    setFormState((prev) => ({ ...prev, newFlow: { ...data } }));
    onNext();
  };

  const action = useFormMethods.getValues(`steps.${stepsArrayMethods.fields.length - 1}.action`);
  const displayAction =
    action &&
    action.type &&
    action.type !== ActionType.TriggerStep &&
    action.type !== ActionType.None
      ? true
      : false;

  return (
    <FormProvider {...useFormMethods}>
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
              {/* TODO: This logic is brittle as hell */}
              {stepsArrayMethods.fields.map((item, index) => {
                const responseFieldLocked = useFormMethods.getValues(
                  `steps.${index}.response.fieldsLocked`,
                );
                const disableDelete =
                  index === 0 && (stepsArrayMethods.fields.length > 1 || !displayAction);
                return (
                  (index > 0 || hasStep0Response) && (
                    <Box key={item.id}>
                      <FlowStage
                        icon={Diversity3OutlinedIcon}
                        label={"Collaboration " + (index + 1).toString()}
                        key={"stage-" + item.id.toString() + index.toString()}
                        deleteHandler={async () => {
                          if (index === 0) {
                            if (disableDelete) return;
                            const stepValues = useFormMethods.getValues(`steps.${index}`);
                            stepsArrayMethods.update(index, {
                              ...stepValues,
                              response: undefined,
                            });
                          } else {
                            stepsArrayMethods.remove(index);
                          }
                          setSelectedId("trigger0");
                        }}
                        disableDelete={responseFieldLocked || disableDelete}
                        hasError={!!useFormMethods.formState.errors.steps?.[index]}
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
              {!displayAction ? (
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
                          locked: false,
                        });
                        // navigate to newly created step
                        setSelectedId(`step${stepsArrayMethods.fields.length}`);
                      }
                    }}
                  />
                  <AddStageButton
                    label={"Trigger webhook"}
                    onClick={() => {
                      useFormMethods.setValue(
                        `steps.${stepsArrayMethods.fields.length - 1}.action`,
                        {
                          filterOptionId: DefaultOptionSelection.None,
                          type: ActionType.CallWebhook,
                          locked: false,
                          callWebhook: {},
                        },
                      );
                      setSelectedId("webhook");
                    }}
                  />
                </Box>
              ) : (
                action && (
                  <FlowStage
                    label={actionProperties[action.type].label}
                    id={"webhook"}
                    icon={actionProperties[action.type].icon}
                    setSelectedId={setSelectedId}
                    selectedId={selectedId}
                    disableDelete={action.locked || !hasStep0Response}
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
                )
              )}
              <FlowStage
                label={"Flow evolution"}
                key={"evolve"}
                hasError={!!useFormMethods.formState.errors.evolve}
                id={"evolve"}
                disableDelete={true}
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
              {action && displayAction && (
                <ActionForm
                  formMethods={useFormMethods}
                  formIndex={stepsArrayMethods.fields.length - 1}
                  show={selectedId === "webhook"}
                  action={action}
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
    </FormProvider>
  );
};
