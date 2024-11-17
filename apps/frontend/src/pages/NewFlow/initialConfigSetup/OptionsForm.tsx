import { Box, FormHelperText, Typography } from "@mui/material";
import { useFormContext, useFormState } from "react-hook-form";

import { AddOptionButton } from "@/components/Form/FlowForm/components/ResultForm/AddOptionButton";
import { TriggerDefinedOptionsForm } from "@/components/Form/FlowForm/components/ResultForm/TriggerDefinedOptionsForm";
import { UsePresetOptionsForm } from "@/components/Form/FlowForm/components/UsePresetOptionsForm";
import { Switch, TextField } from "@/components/Form/formFields";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";

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
  const isReusable = watch("reusable") === Reusable.Reusable;

  return (
    <>
      <FieldBlockFadeIn>
        <Typography variant="description">What options are you deciding between?</Typography>

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
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Box sx={{ margin: "8px 40px 8px 0px" }}>
            {isReusable && (
              <TriggerDefinedOptionsForm<IntitialFlowSetupSchemaType>
                fieldName={"optionsConfig.triggerDefinedOptions"}
              />
            )}
            <Switch<IntitialFlowSetupSchemaType>
              label={"Generate option ideas from partipants"}
              name={"optionsConfig.linkedOptions.hasLinkedOptions"}
              sx={{ marginLeft: "8px" }}
            />
          </Box>
          <PresetOptions />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <AddOptionButton<IntitialFlowSetupSchemaType> optionsArrayMethods={optionsArrayMethods} />

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
        </Box>
      </FieldBlockFadeIn>
    </>
  );
};
