import { FieldFragment, FieldType } from "@/graphql/generated/graphql";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

export const Field = ({ field }: { field: FieldFragment }) => {
  switch (field.__typename) {
    case FieldType.FreeInput: {
      return <Typography>{field.name}</Typography>;
    }
    case FieldType.Options: {
      return (
        <Box>
          <Typography>{field.name}</Typography>
          {field.options.map((option) => {
            return <Typography key={option.optionId}>- {option.name}</Typography>;
          })}
          {field.hasRequestOptions && field.requestOptionsDataType && (
            <Typography>
              - Additional {field.requestOptionsDataType} options defined by triggerer
            </Typography>
          )}
        </Box>
      );
    }
    default:
      return null;
  }
};
