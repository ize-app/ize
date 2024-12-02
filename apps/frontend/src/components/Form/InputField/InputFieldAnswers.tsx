import { Box } from "@mui/material";
import { FieldValues, Path } from "react-hook-form";

import { FieldFragment } from "@/graphql/generated/graphql";

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
        return (
          <InputField<T>
            type="fieldAnswer"
            fieldName={`${basePath}.${field.fieldId}.value` as Path<T>}
            label={field.name}
            field={field}
            key={field.fieldId}
            showLabel={true}
            seperateLabel={true}
          />
        );
      })}
    </Box>
  );
};
