import { Box } from "@mui/material";
import { FieldValues, Path } from "react-hook-form";

import { FieldFragment, FieldType } from "@/graphql/generated/graphql";

import { InputField } from "./InputField";

export const InputFieldAnswers = <T extends FieldValues>({
  fields,
  basePath,
}: {
  fields: FieldFragment[];
  basePath: Path<T>;
}) => {
  if (fields.length === 0) return null;
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginBottom: "24px",
        padding: "20px",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      {fields.map((field) => {
        if (field.__typename === FieldType.FreeInput) {
          return (
            <InputField<T>
              fieldName={`${basePath}.${field.fieldId}.value` as Path<T>}
              label={field.name}
              dataType={field.dataType}
              key={field.fieldId}
              type={FieldType.FreeInput}
              showLabel={true}
              seperateLabel={true}
            />
          );
        } else if ((field.__typename as FieldType) === FieldType.Options) {
          return (
            <InputField<T>
              fieldName={`${basePath}.${field.fieldId}.value` as Path<T>}
              label={field.name}
              key={field.fieldId}
              type={FieldType.Options}
              options={field.options.map((o) => ({
                label: o.name,
                value: o.optionId,
                dataType: o.dataType,
              }))}
              selectionType={field.selectionType}
            />
          );
        }
      })}
    </Box>
  );
};
