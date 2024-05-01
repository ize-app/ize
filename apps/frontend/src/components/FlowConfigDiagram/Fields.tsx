import { FieldFragment } from "@/graphql/generated/graphql";
import { Field } from "./Field";
import Box from "@mui/material/Box";

export const Fields = ({ fields }: { fields: FieldFragment[] }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "8px" }}>
      {fields.map((field) => {
        return <Field key={field.fieldId} field={field} />;
      })}
    </Box>
  );
};
