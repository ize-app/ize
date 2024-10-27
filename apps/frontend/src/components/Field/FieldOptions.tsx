import {
  FieldDataType,
  FieldOptionsSelectionType,
  LinkedResult,
  OptionFieldAnswerSelection,
  Options,
  ResultItemFragment,
} from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

import { FieldOption } from "./FieldOption";
import { FieldOptionsContainer } from "./FieldOptionsContainer";

const linkedResultDescription = (linkedResult: LinkedResult) => {
  return `Options created via previous result: "${linkedResult.resultName} (${linkedResult.fieldName})"`;
};

// renders only the full list of options for a field and option selections, if they are provided
// if final, displays the final list of options. if not final, displays how additional options are created during a request
// this form is brittle and slow. due for a rework
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
  const { options, requestOptionsDataType, linkedResultOptions } = fieldOptions;

  // intended for showing a field answer without the other options
  // used for displaying user field answers in both request and response
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
              final={final}
              dataType={option.dataType}
              selectionType={fieldOptions.selectionType}
              index={index}
            />
          );
        })}
      </FieldOptionsContainer>
    );
  }
  // if result is for a final ranking, display options that are part of result first and other options
  else if (fieldOptions.selectionType === FieldOptionsSelectionType.Rank && final) {
    const nonResultOptions = options.filter((option) => {
      return !optionSelections?.some((os) => os.optionId === option.optionId);
    });
    return (
      <FieldOptionsContainer>
        {optionSelections?.map((os, index) => {
          const option = options.find((o) => o.optionId === os.optionId);
          if (!option) return null;
          return (
            <FieldOption
              isSelected={true}
              key={os.optionId}
              value={option.name}
              final={final}
              dataType={option.dataType}
              selectionType={fieldOptions.selectionType}
              index={index}
            />
          );
        })}
        {nonResultOptions?.map((os) => {
          const option = options.find((o) => o.optionId === os.optionId);
          if (!option) return null;
          return (
            <FieldOption
              isSelected={false}
              key={os.optionId}
              value={option.name}
              index={null}
              final={final}
              dataType={option.dataType}
              selectionType={fieldOptions.selectionType}
            />
          );
        })}
      </FieldOptionsContainer>
    );
  }
  // shows all options for a field
  // if it's not final, it will also describe how options can be created in the option list
  else
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
              final={final}
              selectionType={fieldOptions.selectionType}
              dataType={option.dataType}
            />
          );
        })}
        {!final && requestOptionsDataType && (
          <FieldOption
            selectionType={fieldOptions.selectionType}
            sx={{ fontStyle: "italic", color: muiTheme.palette.primary.main }}
            value={`Additional ${requestOptionsDataType} options defined by triggerer`}
            dataType={FieldDataType.String}
            index={null}
            final={final}
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
                final={final}
                dataType={FieldDataType.String}
              />
            );
          })}
      </FieldOptionsContainer>
    );
};
