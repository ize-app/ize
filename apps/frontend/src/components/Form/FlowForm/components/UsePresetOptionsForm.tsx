import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import { ArrayPath, FieldValues, Path, useFieldArray, useFormContext } from "react-hook-form";

import { stringifyValueType } from "@/components/Value/stringifyValueType";

import { InputField } from "../../InputField/InputField";
import { OptionSchemaType } from "../../InputField/inputValidation";

interface UsePresetOptionsFormProps<T extends FieldValues> {
  fieldsArrayName: ArrayPath<T>;
  locked: boolean;
}

export const UsePresetOptionsForm = <T extends FieldValues>({
  fieldsArrayName,
  locked,
}: UsePresetOptionsFormProps<T>) => {
  const { control, getValues } = useFormContext<T>();
  const optionsArrayMethods = useFieldArray<T>({
    control: control,
    name: fieldsArrayName,
  });

  const PresetOptions = () => {
    return optionsArrayMethods.fields.map((item, inputIndex) => {
      const optionField = `${fieldsArrayName}.${inputIndex}` as Path<T>;

      const valueField = `${fieldsArrayName}.${inputIndex}.input.value` as Path<T>;
      const option = getValues(optionField) as OptionSchemaType;
      return (
        <Box key={item.id} sx={{ display: "flex", alignItems: "center", width: "100%" }}>
          <InputField<T>
            fieldName={valueField}
            label={`Option #${inputIndex + 1} (${stringifyValueType(option?.input?.type)})`}
            type="newOption"
            option={option}
            showLabel={false}
            seperateLabel={false}
          />
          {!locked && (
            <IconButton
              color="primary"
              aria-label="Remove option"
              size="small"
              sx={{ flexShrink: 0 }}
              onClick={() => optionsArrayMethods.remove(inputIndex)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      );
    });
  };
  return { PresetOptions, optionsArrayMethods };
};
