import { Box, FormHelperText } from "@mui/material";
import { useFormContext, useFormState } from "react-hook-form";

import { AddOptionButton } from "@/components/Form/FlowForm/components/AddOptionButton";
import { TriggerDefinedOptionsForm } from "@/components/Form/FlowForm/components/ResultForm/TriggerDefinedOptionsForm";
import { UsePresetOptionsForm } from "@/components/Form/FlowForm/components/UsePresetOptionsForm";
import { Switch, TextField } from "@/components/Form/formFields";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";
import { LabeledGroupedInputs } from "@/components/Form/formLayout/LabeledGroupedInputs";
import { ResponsiveFormRow } from "@/components/Form/formLayout/ResponsiveFormRow";

import { IntitialFlowSetupSchemaType, Reusable } from "../formValidation";

export const OptionsForm = () => {
  const { watch, control } = useFormContext<IntitialFlowSetupSchemaType>();
  const optionsFormState = useFormState({ control, name: "optionsConfig" });
  const { PresetOptions, optionsArrayMethods } = UsePresetOptionsForm<IntitialFlowSetupSchemaType>({
    locked: false,
    fieldsArrayName: `optionsConfig.options`,
  });

  //@ts-expect-error TODO
  //eslint-disable-next-line
  const error = optionsFormState.errors.optionsConfig?.root?.message;

  const hasLinkedOptions = watch("optionsConfig.linkedOptions.hasLinkedOptions");
  const useAi = watch("optionsConfig.linkedOptions.useAi");
  const isReusable = watch("reusable") === Reusable.Reusable;

  return (
    <>
      <FieldBlockFadeIn>
        <LabeledGroupedInputs
          label={"Options"}
          sx={{ padding: "12px", display: "flex", flexDirection: "column", gap: "12px" }}
        >
          {error && (
            <FormHelperText
              sx={{
                color: "error.main",
                marginLeft: "16px",
              }}
            >
              {error}
            </FormHelperText>
          )}
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <PresetOptions />
            <AddOptionButton<IntitialFlowSetupSchemaType>
              optionsArrayMethods={optionsArrayMethods}
            />
          </Box>
          <Box sx={{ maxWidth: "416px" }}>
            {isReusable && (
              <TriggerDefinedOptionsForm<IntitialFlowSetupSchemaType>
                fieldName={"optionsConfig.triggerDefinedOptions"}
              />
            )}
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <ResponsiveFormRow sx={{ display: "flex", alignItems: "center" }}>
              <Switch<IntitialFlowSetupSchemaType>
                label={"Let participants create options"}
                name={"optionsConfig.linkedOptions.hasLinkedOptions"}
                sx={{ marginLeft: "8px", width: "300px" }}
              />
              {hasLinkedOptions && (
                <TextField<IntitialFlowSetupSchemaType>
                  // assuming here that results to fields is 1:1 relationshp
                  name={"optionsConfig.linkedOptions.question"}
                  multiline
                  placeholderText={"What kind of ideas are looking from the community?"}
                  label={``}
                  defaultValue={""}
                />
              )}
            </ResponsiveFormRow>
            {hasLinkedOptions && (
              <ResponsiveFormRow sx={{ display: "flex", alignItems: "center" }}>
                <Switch<IntitialFlowSetupSchemaType>
                  label={"Use AI to deduplicate ideas"}
                  name={"optionsConfig.linkedOptions.useAi"}
                  sx={{ marginLeft: "8px", width: "300px" }}
                />
                {useAi && (
                  <TextField<IntitialFlowSetupSchemaType>
                    // assuming here that results to fields is 1:1 relationshp
                    name={"optionsConfig.linkedOptions.prompt"}
                    multiline
                    placeholderText={"Give the AI instructions on how it should summarize ideas"}
                    label={``}
                    defaultValue={""}
                  />
                )}
              </ResponsiveFormRow>
            )}
          </Box>
        </LabeledGroupedInputs>
      </FieldBlockFadeIn>
    </>
  );
};
