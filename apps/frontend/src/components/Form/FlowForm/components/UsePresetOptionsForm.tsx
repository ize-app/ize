import CloseIcon from "@mui/icons-material/Close";
import { Box, IconButton } from "@mui/material";
import {
  ArrayPath,
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  useFormContext,
} from "react-hook-form";

import { FieldDataType } from "@/graphql/generated/graphql";

import { InputField } from "./InputField";
import { Select } from "../../formFields";
import { ResponsiveFormRow } from "../../formLayout/ResponsiveFormRow";

interface UsePresetOptionsFormProps<T extends FieldValues> {
  fieldsArrayName: ArrayPath<T>;
  locked: boolean;
}

export const UsePresetOptionsForm = <T extends FieldValues>({
  fieldsArrayName,
  locked,
}: UsePresetOptionsFormProps<T>) => {
  const { control, watch } = useFormContext<T>();
  const { fields, remove, append } = useFieldArray<T>({
    control: control,
    name: fieldsArrayName,
  });

  const PresetOptions = () => {
    return fields.map((item, inputIndex) => {
      const dataTypeField = `${fieldsArrayName}.${inputIndex}.dataType` as Path<T>;
      const valueField = `${fieldsArrayName}.${inputIndex}.name` as Path<T>;
      const dataType = watch(dataTypeField);
      return (
        <Box
          key={item.id}
          sx={{
            display: "flex",
            flexDirection: "row",
            flexGrow: 1,
            alignItems: "flex-start",
          }}
        >
          <ResponsiveFormRow key={item.id} sx={{ alignItem: "flex-start" }}>
            <Select<T>
              disabled={locked}
              size={"small"}
              sx={{ width: "140px", flexGrow: 0 }}
              name={dataTypeField}
              key={dataTypeField}
              selectOptions={[
                { name: "Text", value: FieldDataType.String },
                { name: "Number", value: FieldDataType.Number },
                { name: "Url", value: FieldDataType.Uri },
                { name: "Date Time", value: FieldDataType.DateTime },
                { name: "Date", value: FieldDataType.Date },
              ]}
              label="Type"
              defaultValue={"" as PathValue<T, Path<T>>}
            />
            <InputField
              disabled={locked}
              fieldName={valueField}
              dataType={dataType}
              label={`Option #${inputIndex + 1}`}
            />
          </ResponsiveFormRow>

          {!locked && (
            <IconButton
              color="primary"
              aria-label="Remove option"
              size="small"
              sx={{ alignItems: "flex-start" }}
              onClick={() => remove(inputIndex)}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>
      );
    });
  };
  return { PresetOptions, append };
};
