import { LinkedResult, Options } from "@/graphql/generated/graphql";
import { Box, Typography } from "@mui/material";

const linkedResultDescription = (linkedResult: LinkedResult) => {
  return `${linkedResult.resultType} from "${linkedResult.fieldName}"`;
};

// renders only the list of options
export const FieldOptions = ({ fieldOptions }: { fieldOptions: Options }) => {
  // optionsConfig.
  const { options, requestOptionsDataType, hasRequestOptions, linkedResultOptions, selectionType } =
    fieldOptions;
  return (
    <Box
      component="ul"
      sx={{ marginBlockStart: "12px", marginBlockEnd: "0px", paddingInlineStart: "18px" }}
    >
      {options.map((option) => {
        return (
          <Typography component={"li"} fontSize={".875rem"} color="secondary" key={option.optionId}>
            {option.name}
          </Typography>
        );
      })}
      {hasRequestOptions && requestOptionsDataType && (
        <Typography component={"li"} fontSize={".875rem"} color="primary" fontStyle={"italic"}>
          Additional {requestOptionsDataType} options defined by triggerer
        </Typography>
      )}
      {linkedResultOptions.map((lr) => {
        return (
          <Typography
            key={lr.resultConfigId + lr.fieldId}
            component={"li"}
            fontSize={".875rem"}
            color="primary"
            fontStyle={"italic"}
          >
            {linkedResultDescription(lr)}
          </Typography>
        );
      })}
    </Box>
  );
};
