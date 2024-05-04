import {
  FieldOptionsSelectionType,
  LinkedResult,
  OptionFieldAnswerSelection,
  Options,
} from "@/graphql/generated/graphql";
import { Box, Typography } from "@mui/material";

const linkedResultDescription = (linkedResult: LinkedResult) => {
  return `${linkedResult.resultType} from "${linkedResult.fieldName}"`;
};

// renders only the list of options
export const FieldOptions = ({
  fieldOptions,
  optionSelections,
  final,
}: {
  fieldOptions: Options;
  optionSelections?: OptionFieldAnswerSelection[] | undefined;
  final: boolean;
}) => {
  const { options, requestOptionsDataType, hasRequestOptions, linkedResultOptions, selectionType } =
    fieldOptions;
  return (
    <Box
      component="ul"
      sx={{
        borderRadius: "4px",
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        marginBlockStart: "0px",
        marginBlockEnd: "0px",
        paddingInlineStart: "0px",
        listStyleType: "none",
        "& li": { borderBottom: "1px solid rgba(0, 0, 0, 0.1)" },
      }}
    >
      {options.map((option) => {
        const isSelected = optionSelections?.some((os) => os.optionId === option.optionId);
        console.log("isSelected", isSelected);
        return (
          <Typography
            sx={(theme) => ({
              backgroundColor: isSelected ? "#ffffe6" : "inherit",
              padding: "6px 12px",
            })}
            component={"li"}
            fontWeight={isSelected ? "bold" : "normal"}
            color={isSelected ? "primary" : "secondary"}
            key={option.optionId}
            fontSize={".875rem"}
          >
            {option.name}
          </Typography>
          // </Box>
        );
      })}
      {!final && hasRequestOptions && requestOptionsDataType && (
        <Typography component={"li"} fontSize={".875rem"} color="primary" fontStyle={"italic"}>
          Additional {requestOptionsDataType} options defined by triggerer
        </Typography>
      )}
      {!final &&
        linkedResultOptions.map((lr) => {
          return (
            <Typography
              key={lr.resultConfigId + lr.fieldId}
              fontSize={".875rem"}
              component={"li"}
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
