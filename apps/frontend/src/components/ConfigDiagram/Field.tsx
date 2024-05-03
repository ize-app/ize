import { FieldFragment, FieldType } from "@/graphql/generated/graphql";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { FieldOptions } from "./FieldOptions";

export const Field = ({ field }: { field: FieldFragment }) => {
  switch (field.__typename) {
    case FieldType.FreeInput: {
      return <Typography>{field.name}</Typography>;
    }
    case FieldType.Options: {
      return (
        <Box>
          <Typography>{field.name}</Typography>
          <FieldOptions fieldOptions={field} />
        </Box>
      );
    }
    default:
      return null;
  }
};
