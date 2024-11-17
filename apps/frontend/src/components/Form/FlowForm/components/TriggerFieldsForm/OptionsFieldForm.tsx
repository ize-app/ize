import { Box } from "@mui/material";

import { FieldOptionsSelectionType } from "@/graphql/generated/graphql";

import { FieldFormProps, triggerFieldsPath } from "./TriggerFieldsForm";
import { Select } from "../../../formFields";
import { ResponsiveFormRow } from "../../../formLayout/ResponsiveFormRow";
import { FlowSchemaType } from "../../formValidation/flow";
import { AddOptionButton } from "../ResultForm/AddOptionButton";
import { UsePresetOptionsForm } from "../UsePresetOptionsForm";

export const OptionFieldForm = ({ fieldIndex, locked }: FieldFormProps) => {
  const { PresetOptions, optionsArrayMethods } = UsePresetOptionsForm<FlowSchemaType>({
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
        <AddOptionButton<FlowSchemaType> optionsArrayMethods={optionsArrayMethods} />
      </Box>
    </>
  );
};
