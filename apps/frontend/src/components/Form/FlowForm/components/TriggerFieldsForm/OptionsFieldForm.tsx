import { Box, FormHelperText, Typography } from "@mui/material";
import { useFormContext } from "react-hook-form";

import { OptionSelectionType } from "@/graphql/generated/graphql";

import { FieldFormProps, triggerFieldsPath } from "./TriggerFieldsForm";
import { Select } from "../../../formFields";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { FlowSchemaType } from "../../formValidation/flow";
import { AddOptionButton } from "../AddOptionButton";
import { maxOptionSelectionsOptions } from "../maxOptionSelections";
import { UsePresetOptionsForm } from "../UsePresetOptionsForm";

export const OptionFieldForm = ({ fieldIndex, locked }: FieldFormProps) => {
  const { watch, formState } = useFormContext<FlowSchemaType>();
  const { PresetOptions, optionsArrayMethods } = UsePresetOptionsForm<FlowSchemaType>({
    locked,
    fieldsArrayName: `${triggerFieldsPath}.${fieldIndex}.optionsConfig.options`,
  });

  const optionsError = formState.errors?.fieldSet?.fields?.[fieldIndex]?.root?.message ?? "";

  const optionSelectionType = watch(
    `${triggerFieldsPath}.${fieldIndex}.optionsConfig.selectionType`,
  );

  return (
    <>
      <Typography variant="description">How options are selected</Typography>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          disabled={locked}
          name={`${triggerFieldsPath}.${fieldIndex}.optionsConfig.selectionType`}
          size="small"
          selectOptions={[
            {
              name: "Choose option(s)",
              value: OptionSelectionType.Select,
            },

            {
              name: "Rank options",
              value: OptionSelectionType.Rank,
            },
          ]}
          label="How do participants select options?"
        />
        {optionSelectionType === OptionSelectionType.Select && (
          <Select<FlowSchemaType>
            defaultValue=""
            display={optionSelectionType === OptionSelectionType.Select}
            label="How many options can be selected?"
            selectOptions={maxOptionSelectionsOptions}
            name={`${triggerFieldsPath}.${fieldIndex}.optionsConfig.maxSelections`}
            size={"small"}
          />
        )}
      </ResponsiveFormRow>
      <Typography variant="description">Available options</Typography>
      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}
      >
        <PresetOptions />
        <AddOptionButton<FlowSchemaType> optionsArrayMethods={optionsArrayMethods} />
      </Box>
      {optionsError && (
        <FormHelperText
          sx={{
            color: "error.main",
          }}
        >
          {optionsError}
        </FormHelperText>
      )}
    </>
  );
};
