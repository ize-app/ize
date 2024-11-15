import { zodResolver } from "@hookform/resolvers/zod";
import { FormHelperText, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import { forwardRef, useImperativeHandle, useState } from "react";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";

import {
  ConfigurationPanel,
  DiagramPanel,
  FlowConfigDiagramContainer,
  PanelContainer,
  PanelHeader,
} from "@/components/ConfigDiagram";
import { StageType } from "@/components/ConfigDiagram/Stage/StageType";
import { useNewFlowWizardState } from "@/pages/NewFlow/newFlowWizard";

import { ActionFilterForm } from "./components/ActionFilterForm";
import { ActionForm } from "./components/ActionForm/ActionForm";
import { AddStepButton } from "./components/AddStepButton";
import { FlowFormStage } from "./components/FlowFormStage";
import { StepForm } from "./components/StepForm";
import { TriggerForm } from "./components/TriggerForm";
import { FlowSchemaType, flowSchema } from "./formValidation/flow";
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
    const [selectedId, setSelectedId] = useState<string | false>("trigger0");

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
                <FlowFormStage
                  key="trigger0"
                  type={StageType.Trigger}
                  id={"trigger0"}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  //@ts-expect-error TODO
                  stepsArrayMethods={stepsArrayMethods}
                />

                <AddStepButton
                  positionIndex={0}
                  //@ts-expect-error TODO
                  stepsArrayMethods={stepsArrayMethods}
                  setSelectedId={setSelectedId}
                />
                {stepsArrayMethods.fields.map((item, index) => {
                  return (
                    (index > 0 || hasStep0Response) && (
                      <Box
                        key={item.id}
                        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
                      >
                        <FlowFormStage
                          key={"step-" + item.id.toString() + index.toString()}
                          type={StageType.Step}
                          index={index}
                          id={"step" + index.toString()}
                          setSelectedId={setSelectedId}
                          selectedId={selectedId}
                          //@ts-expect-error TODO
                          stepsArrayMethods={stepsArrayMethods}
                        />
                        <FlowFormStage
                          key={"actionFilter-" + item.id.toString() + index.toString()}
                          type={StageType.ActionFilter}
                          index={index}
                          id={"actionFilter" + index.toString()}
                          setSelectedId={setSelectedId}
                          selectedId={selectedId}
                          //@ts-expect-error TODO
                          stepsArrayMethods={stepsArrayMethods}
                        />
                        <AddStepButton
                          positionIndex={index + 1}
                          //@ts-expect-error TODO
                          stepsArrayMethods={stepsArrayMethods}
                          setSelectedId={setSelectedId}
                        />
                      </Box>
                    )
                  );
                })}
                <FlowFormStage
                  type={StageType.Action}
                  index={stepsArrayMethods.fields.length - 1}
                  id={"webhook"}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  //@ts-expect-error TODO
                  stepsArrayMethods={stepsArrayMethods}
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
                {stepsArrayMethods.fields.map((item, index) => {
                  // if (stepsArrayMethods.fields.length === 1 && !hasStep0Response) return null;
                  const hasAction = !!useFormMethods.getValues(
                    `steps.${index}.action.filterOptionId`,
                  );
                  if (!hasAction) return null;
                  return (
                    <ActionFilterForm
                      stepIndex={index}
                      key={"actionFilter-" + item.id}
                      show={selectedId === "actionFilter" + index.toString()}
                    />
                  );
                })}

                <ActionForm
                  stepIndex={stepsArrayMethods.fields.length - 1}
                  show={selectedId === "webhook"}
                />
              </ConfigurationPanel>
            </PanelContainer>
          </FlowConfigDiagramContainer>
        </form>
      </FormProvider>
    );
  },
);

FlowForm.displayName = "FlowForm";
