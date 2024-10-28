import { zodResolver } from "@hookform/resolvers/zod";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { forwardRef, useImperativeHandle, useState } from "react";
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
import { StageConnectorButton } from "@/components/ConfigDiagram/DiagramPanel/StageConnectorButton";
import { getResultFormLabel } from "@/components/Form/FlowForm/helpers/getResultFormLabel";
import { ActionType } from "@/graphql/generated/graphql";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";

import { ActionForm } from "./components/ActionForm/ActionForm";
import { StepForm } from "./components/StepForm";
import { TriggerForm } from "./components/TriggerForm";
import { DefaultOptionSelection } from "./formValidation/fields";
import { FlowSchemaType, flowSchema } from "./formValidation/flow";
import { defaultStepFormValues } from "./helpers/getDefaultFormValues";
import { StreamlinedTextField } from "../formFields";

interface FlowFormProps {
  name: "flow" | "evolve";
  isReusable: boolean;
  defaultFormValues: FlowSchemaType;
}

export interface FlowFormRef {
  validate: () => Promise<{ isValid: boolean; values: FlowSchemaType }>;
}

export const FlowForm = forwardRef(
  ({ name, isReusable, defaultFormValues }: FlowFormProps, ref) => {
    const { formState } = useNewFlowWizardState();
    const [selectedId, setSelectedId] = useState<string | false>("trigger0"); // change to step1

    const fieldArrayName = "steps";

    const useFormMethods = useForm<FlowSchemaType>({
      defaultValues: {
        name: formState.new[name]?.name ?? defaultFormValues.name,
        type: formState.new[name]?.type ?? defaultFormValues.type,
        fieldSet: formState.new[name]?.fieldSet ?? defaultFormValues.fieldSet,
        trigger: formState.new[name]?.trigger ?? defaultFormValues.trigger,
        steps: formState.new[name]?.steps
          ? [...formState.new[name].steps]
          : defaultFormValues.steps,
      },
      resolver: zodResolver(flowSchema),
      shouldUnregister: false,
    });

    // console.log(name, "errors are ", useFormMethods.formState.errors);
    // console.log(name, "values are ", useFormMethods.getValues());

    const hasStep0Response = !!useFormMethods.getValues(`steps.0.response`);

    const stepsArrayMethods = useFieldArray({
      control: useFormMethods.control,
      name: fieldArrayName,
    });

    // allows parent component to call validate on this component
    useImperativeHandle(
      ref,
      (): FlowFormRef => ({
        validate: async () => {
          const isValid = await useFormMethods.trigger();
          const values = flowSchema.parse(useFormMethods.getValues());

          return { isValid, values };
        },
      }),
    );

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
                  disabled={name === "evolve"}
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
                  hasError={
                    !!useFormMethods.formState.errors.fieldSet ||
                    !!useFormMethods.formState.errors.trigger
                  }
                  icon={PlayCircleOutlineOutlinedIcon}
                />
                <StageConnectorButton />
                {/* TODO: This logic is brittle as hell */}
                {stepsArrayMethods.fields.map((item, index) => {
                  const responseFieldLocked = useFormMethods.getValues(
                    `steps.${index}.fieldSet.locked`,
                  );
                  const result = useFormMethods.getValues(`steps.${index}.result.${0}`);
                  const fieldName = useFormMethods.getValues(
                    `steps.${index}.fieldSet.fields.${0}.name`,
                  );
                  // item.result[0].type
                  const disableDelete =
                    index === 0 && (stepsArrayMethods.fields.length > 1 || !displayAction);
                  return (
                    (index > 0 || hasStep0Response) && (
                      <Box key={item.id}>
                        <FlowStage
                          icon={Diversity3OutlinedIcon}
                          label={getResultFormLabel({ result })}
                          subtitle={fieldName}
                          key={"stage-" + item.id.toString() + index.toString()}
                          deleteHandler={() => {
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
                        !!useFormMethods.formState.errors.steps?.[
                          stepsArrayMethods.fields.length - 1
                        ]?.action
                      }
                    />
                  )
                )}
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
                <TriggerForm show={selectedId === "trigger0"} isReusable={isReusable} />
                {stepsArrayMethods.fields.map((item, index) => {
                  if (stepsArrayMethods.fields.length === 1 && !hasStep0Response) return null;
                  return (
                    <StepForm
                      reusable={isReusable}
                      stepIndex={index}
                      key={"step-" + item.id}
                      show={selectedId === "step" + index.toString()}
                    />
                  );
                })}
                {action && displayAction && (
                  <ActionForm
                    stepIndex={stepsArrayMethods.fields.length - 1}
                    show={selectedId === "webhook"}
                    action={action}
                  />
                )}
              </ConfigurationPanel>
            </PanelContainer>
          </FlowConfigDiagramContainer>
        </form>
      </FormProvider>
    );
  },
);

FlowForm.displayName = "FlowForm";
