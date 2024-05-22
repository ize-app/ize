import {
  FieldDataType,
  LinkedResult,
  OptionFieldAnswerSelection,
  Options,
  ResultItemFragment,
} from "@/graphql/generated/graphql";
import { Box } from "@mui/material";
import { FieldOption } from "./FieldOption";
import muiTheme from "@/style/muiTheme";
import { ReactNode } from "react";

const linkedResultDescription = (linkedResult: LinkedResult) => {
  return `${linkedResult.resultType} from "${linkedResult.fieldName}"`;
};

const FieldOptionsContainer = ({ children }: { children: ReactNode }) => {
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
        backgroundColor: "white",
        // "& li": { borderBottom: "1px solid rgba(0, 0, 0, 0.1)" },
      }}
    >
      {children}
    </Box>
  );
};

// renders only the full list of options for a field and option selections, if they are provided
// if final, displays the final list of options. if not final, displays how additional options are created during a request
export const FieldOptions = ({
  fieldOptions,
  optionSelections,
  onlyShowSelections = false,
  final,
}: {
  fieldOptions: Options;
  optionSelections?: OptionFieldAnswerSelection[] | ResultItemFragment[] | undefined;
  onlyShowSelections?: boolean;
  final: boolean;
}) => {
  const { options, requestOptionsDataType, hasRequestOptions, linkedResultOptions } = fieldOptions;

  if (onlyShowSelections) {
    return (
      <FieldOptionsContainer>
        {optionSelections?.map((os, index) => {
          const option = options.find((o) => o.optionId === os.optionId);
          if (!option) return null;
          return (
            <FieldOption
              key={os.optionId}
              value={option.name}
              dataType={option.dataType}
              selectionType={fieldOptions.selectionType}
              index={index}
            />
          );
        })}
      </FieldOptionsContainer>
    );
  } else
    return (
      <FieldOptionsContainer>
        {options.map((option, index) => {
          const isSelected =
            optionSelections?.some((os) => os.optionId === option.optionId) ?? false;
          return (
            <FieldOption
              key={option.optionId}
              isSelected={isSelected}
              value={option.name}
              index={index}
              selectionType={fieldOptions.selectionType}
              dataType={option.dataType as FieldDataType}
            />
          );
        })}
        {!final && hasRequestOptions && requestOptionsDataType && (
          <FieldOption
            selectionType={fieldOptions.selectionType}
            sx={{ fontStyle: "italic", color: muiTheme.palette.primary.main }}
            value={`Additional ${requestOptionsDataType} options defined by triggerer`}
            dataType={FieldDataType.String}
            index={null}
          />
        )}
        {!final &&
          linkedResultOptions.map((lr) => {
            return (
              <FieldOption
                key={lr.resultConfigId + lr.fieldId}
                selectionType={fieldOptions.selectionType}
                sx={{ fontStyle: "italic", color: muiTheme.palette.primary.main }}
                value={linkedResultDescription(lr)}
                index={null}
                dataType={FieldDataType.String}
              />
            );
          })}
      </FieldOptionsContainer>
    );
};
