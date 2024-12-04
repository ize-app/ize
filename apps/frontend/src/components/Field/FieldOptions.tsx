import LinkIcon from "@mui/icons-material/Link";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Box, Typography } from "@mui/material";

import {
  FieldFragment,
  LinkedResult,
  OptionFragment,
  OptionSelectionFragment,
  OptionSelectionType,
  ResponseFieldAnswersOptionsSummaryFragment,
  ResponseFieldAnswersSummaryFragment,
  ResultItemFragment,
} from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

import { FieldOption } from "./FieldOption";
import { stringifyValueType } from "../Value/stringifyValueType";

const linkedResultDescription = (linkedResult: LinkedResult) => {
  return `Options created via previous result: "${linkedResult.resultName} (${linkedResult.fieldName})"`;
};

// renders only the full list of options for a field and option selections, if they are provided
// if final, displays the final list of options. if not final, displays how additional options are created during a request

export const FieldOptions = ({
  field,
  optionSelections,
  onlyShowSelections = false,
  finalOptions,
  responseSummary,
  triggerDefinedOptions,
}: {
  field: FieldFragment;
  optionSelections?: OptionSelectionFragment[] | ResultItemFragment[];
  onlyShowSelections?: boolean;
  finalOptions: boolean;
  responseSummary?: ResponseFieldAnswersSummaryFragment | null | undefined;
  triggerDefinedOptions?: OptionFragment[];
}) => {
  if (!field.optionsConfig) return null;

  const { triggerOptionsType, linkedResultOptions, options, selectionType } = field.optionsConfig;

  const totalResponses =
    selectionType === OptionSelectionType.Rank
      ? ((responseSummary?.options ?? []).reduce((acc, o) => acc + (o.rank ?? 0), 0) ?? 0)
      : (responseSummary?.count ?? 0);

  const allOptions = [...options];

  if (!finalOptions && !!triggerDefinedOptions) allOptions.push(...triggerDefinedOptions);

  const hydratedOptions: {
    option: OptionFragment;
    optionSummary: ResponseFieldAnswersOptionsSummaryFragment | undefined;
    isSelected: boolean;
    selectionIndex: number;
  }[] = allOptions
    .map((option) => {
      const selectionIndex =
        (optionSelections ?? []).findIndex((os) => os.optionId === option.optionId) ?? false;

      const isSelected = selectionIndex !== -1;

      const optionSummary = (responseSummary?.options ?? []).find(
        (o) => o.optionId === option.optionId,
      );
      return {
        option,
        optionSummary,
        isSelected,
        selectionIndex,
      };
    })
    .filter((o) => {
      if (onlyShowSelections) return o.isSelected;
      else return true;
    })
    .sort((a, b) => {
      if (responseSummary) {
        return (b.optionSummary?.count ?? 0) - (a.optionSummary?.count ?? 0);
      }
      if (optionSelections) return a.selectionIndex - b.selectionIndex;
      // keep default order if there is no response summary
      else return 0;
    });
  return (
    <>
      {hydratedOptions.map((o, index) => {
        return (
          <FieldOption
            key={o.option.optionId}
            value={o.option.value}
            final={finalOptions}
            selectionType={selectionType}
            totalResponses={totalResponses}
            optionResponseSummary={o.optionSummary}
            index={index}
            isSelected={o.isSelected && !onlyShowSelections}
          />
        );
      })}
      {!finalOptions && triggerOptionsType && !triggerDefinedOptions && (
        <Box sx={{ display: "flex", padding: "6px 12px" }}>
          <PlayCircleOutlineIcon
            sx={{ color: muiTheme.palette.secondary.main, marginRight: "8px" }}
          />
          <Typography color="secondary">
            Trigger can define additional {stringifyValueType(triggerOptionsType)} options
          </Typography>
        </Box>
      )}
      {!finalOptions &&
        linkedResultOptions.map((lr) => {
          return (
            <Box sx={{ display: "flex", padding: "6px 12px" }} key={lr.resultConfigId + lr.fieldId}>
              <LinkIcon sx={{ color: muiTheme.palette.secondary.main, marginRight: "8px" }} />
              <Typography color="secondary">{linkedResultDescription(lr)}</Typography>
            </Box>
          );
        })}
    </>
  );
};
