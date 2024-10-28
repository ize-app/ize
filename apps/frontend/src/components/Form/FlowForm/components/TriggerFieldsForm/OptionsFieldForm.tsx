import { Box, Button } from "@mui/material";

import { FieldOptionsSelectionType } from "@/graphql/generated/graphql";

import { FieldFormProps, triggerFieldsPath } from "./TriggerFieldsForm";
import { Select } from "../../../formFields";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { FlowSchemaType } from "../../formValidation/flow";
import { createDefaultOptionState } from "../../helpers/defaultFormState/createDefaultOptionState";
import { UsePresetOptionsForm } from "../UsePresetOptionsForm";

export const OptionFieldForm = ({ fieldIndex, locked }: FieldFormProps) => {
  const { PresetOptions, append } = UsePresetOptionsForm<FlowSchemaType>({
    locked,
    fieldsArrayName: `${triggerFieldsPath}.${fieldIndex}.optionsConfig.options`,
  });
  // const optionsSelctionTypePath = `${name}.optionsConfig.selectionType` as Path<FlowSchemaType>;

  // if (!selectionType) return null;

  return (
    <>
      <ResponsiveFormRow>
        <Select<FlowSchemaType>
          disabled={locked}
          name={`${triggerFieldsPath}.${fieldIndex}.optionsConfig.selectionType`}
          size="small"
          selectOptions={[
            {
              name: "Select one option",
              value: FieldOptionsSelectionType.Select,
            },
            {
              name: "Select multiple options",
              value: FieldOptionsSelectionType.MultiSelect,
            },
            {
              name: "Rank options",
              value: FieldOptionsSelectionType.Rank,
            },
          ]}
          // defaultValue={FieldOptionsSelectionType.Select}
          label="How do participants select options?"
        />
      </ResponsiveFormRow>

      <Box
        sx={{ width: "100%", display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}
      >
        <PresetOptions />
        <ResponsiveFormRow>
          <Button
            sx={{ position: "relative" }}
            variant="outlined"
            size="small"
            onClick={() => {
              append(createDefaultOptionState());
            }}
          >
            Add option
          </Button>
        </ResponsiveFormRow>
      </Box>
    </>
  );
};
