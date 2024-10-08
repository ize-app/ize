import { Box, Button, FormHelperText, Typography } from "@mui/material";
import { useFormContext, useFormState } from "react-hook-form";

import { UsePresetOptionsForm } from "@/components/Form/FlowForm/components/UsePresetOptionsForm";
import { createDefaultOptionState } from "@/components/Form/FlowForm/helpers/defaultFormState/createDefaultOptionState";
import { Switch, TextField } from "@/components/Form/formFields";
import { FieldBlockFadeIn } from "@/components/Form/formLayout/FieldBlockFadeIn";

import { IntitialFlowSetupSchemaType } from "../formValidation";

export const OptionsForm = () => {
  const { watch, control } = useFormContext<IntitialFlowSetupSchemaType>();
  const optionsFormState = useFormState({ control, name: "optionsConfig" });
  const { PresetOptions, append } = UsePresetOptionsForm<IntitialFlowSetupSchemaType>({
    locked: false,
    fieldsArrayName: `optionsConfig.options`,
  });

  //@ts-expect-error TODO
  //eslint-disable-next-line
  const error = optionsFormState.errors.optionsConfig?.root?.message;

  const hasLinkedOptions = watch("optionsConfig.linkedOptions.hasLinkedOptions");

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
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <PresetOptions />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <Box sx={{ marginBottom: "8px" }}>
            <Button
              sx={{ position: "relative" }}
              variant="text"
              size="small"
              onClick={() => {
                append(createDefaultOptionState());
              }}
            >
              Add option
            </Button>
          </Box>
          <Switch<IntitialFlowSetupSchemaType>
            label={"Requestor can create additional options"}
            name={"optionsConfig.requestCreatedOptions"}
            sx={{ marginLeft: "8px" }}
            defaultValue={false}
          />
          <Switch<IntitialFlowSetupSchemaType>
            label={"Generate option ideas from partipants"}
            name={"optionsConfig.linkedOptions.hasLinkedOptions"}
            sx={{ marginLeft: "8px" }}
            defaultValue={false}
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
        </Box>
      </FieldBlockFadeIn>
    </>
  );
};
