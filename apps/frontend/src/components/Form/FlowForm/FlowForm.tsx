import { zodResolver } from "@hookform/resolvers/zod";
import AddIcon from "@mui/icons-material/Add";
import Diversity3OutlinedIcon from "@mui/icons-material/Diversity3Outlined";
import PlayCircleOutlineOutlinedIcon from "@mui/icons-material/PlayCircleOutlineOutlined";
import { FormHelperText, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
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
import { ActionSchemaType } from "./formValidation/action";
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

    console.log("selectedId is ", selectedId);

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

    const flowError = useFormMethods.formState.errors.steps;
    console.log("flow steps errors are ", flowError);

    if (name !== "evolve") {
      console.log(name, "errors are ", useFormMethods.formState.errors);
      console.log(name, "values are ", useFormMethods.getValues());
    }

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

    const deleteStepHandler = useCallback(
      (index: number, isFinalStep: boolean) => {
        // note: setSelectedId is not working right now. issue is with how deleteHandler is passed to child components
        // Set the selected ID to the previous step before deleting
        setSelectedId(`trigger0`);
        if (index === 0 && stepsArrayMethods.fields.length === 1) {
          //if only one step, then reset response/result/fieldset fields
          const currentStepVal = useFormMethods.getValues(`steps.${0}`);
          useFormMethods.setValue(`steps.${0}`, {
            ...currentStepVal,
            response: undefined,
            result: defaultStepFormValues.result,
            fieldSet: defaultStepFormValues.fieldSet,
          });
        } else if (isFinalStep) {
          // if there are more then one steps, copy the action from the current final step to the new final step
          useFormMethods.setValue(
            `steps.${index - 1}.action`,
            useFormMethods.getValues(`steps.${index}.action`),
          );
          //then remove the step
          stepsArrayMethods.remove(index);
        } else {
          stepsArrayMethods.remove(index);
        }
      },
      [setSelectedId, stepsArrayMethods, useFormMethods],
    );

    const deleteFinalActionHandler = useCallback(() => {
      // note: setSelectedId is not working right now. issue is with how deleteHandler is passed to child components
      setSelectedId("trigger0");
      useFormMethods.setValue(`steps.${stepsArrayMethods.fields.length - 1}.action`, undefined);
    }, [setSelectedId, stepsArrayMethods, useFormMethods]);

    const addStepHandler = useCallback(
      (positionIndex: number) => {
        console.log("inside add step handler");
        const currentStepLength = stepsArrayMethods.fields.length;
        const currentFinalStepIndex = Math.max(stepsArrayMethods.fields.length - 1, 0);

        if (currentStepLength === 0) {
          console.log("inside add step handler, currentStepLength is 0");
          stepsArrayMethods.append(defaultStepFormValues);
        }
        // there will usually be a first step, but sometimes that step is just an action (no response) and other times it actually has a response
        else if (currentStepLength === 1 && positionIndex === 0) {
          // if there's a response, insert a new step
          if (useFormMethods.getValues(`steps.${0}.response`)) {
            stepsArrayMethods.prepend(defaultStepFormValues);
          }
          // if no response, overwrite step 0 to have a response config
          // this will allow it display in the UI as a collaborative step
          // this will also preserve any previously created actions, if there is one
          else {
            useFormMethods.setValue(`steps.${0}.response`, defaultStepFormValues.response);
          }
        } else if (positionIndex === currentFinalStepIndex + 1) {
          const newStep = { ...defaultStepFormValues };
          // copy over final action to new final step
          newStep.action = useFormMethods.getValues(`steps.${currentFinalStepIndex}.action`);
          stepsArrayMethods.append(newStep);
          // change previous final step to have a trigger action
          useFormMethods.setValue(`steps.${currentFinalStepIndex}.action`, {
            filterOptionId: DefaultOptionSelection.None,
            type: ActionType.TriggerStep,
            locked: false,
          });
        } else {
          stepsArrayMethods.insert(positionIndex, defaultStepFormValues);
        }
        setSelectedId(`step${positionIndex}`);
      },
      [setSelectedId, stepsArrayMethods, useFormMethods],
    );

    const action = useFormMethods.getValues(
      `steps.${stepsArrayMethods.fields.length - 1}.action`,
    ) as ActionSchemaType;
    const displayAction =
      action && action.type && action.type !== ActionType.TriggerStep ? true : false;

    return (
      <FormProvider {...useFormMethods}>
        <form style={{ height: "100%" }}>
          <FlowConfigDiagramContainer>
            {flowError?.root && (
              <FormHelperText
                sx={{
                  color: "error.main",
                }}
              >
                {flowError?.root.message}
              </FormHelperText>
            )}
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
                <IconButton onClick={() => addStepHandler(0)}>
                  <AddIcon />
                </IconButton>
                {/* TODO: This logic is brittle as hell */}
                {stepsArrayMethods.fields.map((item, index) => {
                  const isFinalStep = index === stepsArrayMethods.fields.length - 1;
                  const responseFieldLocked = useFormMethods.getValues(
                    `steps.${index}.fieldSet.locked`,
                  );
                  const result = useFormMethods.getValues(`steps.${index}.result.${0}`);
                  const fieldName = useFormMethods.getValues(
                    `steps.${index}.fieldSet.fields.${0}.name`,
                  );
                  // item.result[0].type
                  // const disableDelete =
                  //   index === 0 && (stepsArrayMethods.fields.length > 1 || !displayAction);
                  return (
                    (index > 0 || hasStep0Response) && (
                      <Box
                        key={item.id}
                        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                      >
                        <FlowStage
                          icon={Diversity3OutlinedIcon}
                          label={getResultFormLabel({ result })}
                          subtitle={fieldName}
                          key={"stage-" + item.id.toString() + index.toString()}
                          deleteHandler={() => deleteStepHandler(index, isFinalStep)}
                          disableDelete={responseFieldLocked}
                          hasError={!!useFormMethods.formState.errors.steps?.[index]}
                          id={"step" + index.toString()}
                          setSelectedId={setSelectedId}
                          selectedId={selectedId}
                        />
                        <StageConnectorButton
                          key={"connector-" + item.id.toString() + index.toString()}
                        />
                        <IconButton onClick={() => addStepHandler(index + 1)}>
                          <AddIcon />
                        </IconButton>
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
                      disableDelete={action.locked}
                      deleteHandler={() => deleteFinalActionHandler()}
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
