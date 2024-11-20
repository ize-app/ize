import LinkIcon from "@mui/icons-material/Link";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";
import { Box, Typography } from "@mui/material";

import {
  FieldOptionsSelectionType,
  LinkedResult,
  OptionFieldAnswerSelection,
  OptionFragment,
  Options,
  ResponseFieldAnswersOptionsSummaryFragment,
  ResponseFieldAnswersSummaryFragment,
  ResultItemFragment,
} from "@/graphql/generated/graphql";
import muiTheme from "@/style/muiTheme";

import { FieldOption } from "./FieldOption";
import { formatDataTypeName } from "./formatDataTypeName";
import { LabeledGroupedInputs } from "../Form/formLayout/LabeledGroupedInputs";

const linkedResultDescription = (linkedResult: LinkedResult) => {
  return `Options created via previous result: "${linkedResult.resultName} (${linkedResult.fieldName})"`;
};

// renders only the full list of options for a field and option selections, if they are provided
// if final, displays the final list of options. if not final, displays how additional options are created during a request

export enum FieldOptionsDisplayType {
  FinalResult = "FinalResult",
  PendingResult = "PendingResult",
  Options = "Options",
  Answer = "Answer",
}

const optionsLabel: { [key in FieldOptionsDisplayType]: string } = {
  [FieldOptionsDisplayType.FinalResult]: "Final result",
  [FieldOptionsDisplayType.PendingResult]: "Pending result: Still collecting responses",
  [FieldOptionsDisplayType.Options]: "Options",
  [FieldOptionsDisplayType.Answer]: "",
};

export const FieldOptions = ({
  type,
  fieldOptions,
  optionSelections,
  onlyShowSelections = false,
  final,
  responseSummary,
}: {
  type: FieldOptionsDisplayType;
  fieldOptions: Options;
  optionSelections?: OptionFieldAnswerSelection[] | ResultItemFragment[] | undefined;
  onlyShowSelections?: boolean;
  final: boolean;
  responseSummary?: ResponseFieldAnswersSummaryFragment | null | undefined;
}) => {
  const { requestOptionsDataType, linkedResultOptions } = fieldOptions;

  const totalResponses =
    fieldOptions.selectionType === FieldOptionsSelectionType.Rank
      ? (responseSummary?.options ?? []).reduce((acc, o) => acc + (o.rank ?? 0), 0) ?? 0
      : responseSummary?.count ?? 0;

  const hydratedOptions: {
    option: OptionFragment;
    optionSummary: ResponseFieldAnswersOptionsSummaryFragment | undefined;
    isSelected: boolean;
    selectionIndex: number;
  }[] = fieldOptions.options
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
    <LabeledGroupedInputs label={optionsLabel[type]} sx={{ backgroundColor: "white" }}>
      {/* <FieldOptionsContainer> */}
      {hydratedOptions.map((o, index) => {
        return (
          <FieldOption
            key={o.option.optionId}
            value={o.option.name}
            final={final}
            dataType={o.option.dataType}
            selectionType={fieldOptions.selectionType}
            totalResponses={totalResponses}
            optionResponseSummary={o.optionSummary}
            index={index}
            isSelected={o.isSelected && !onlyShowSelections}
          />
        );
      })}
      {!final && requestOptionsDataType && (
        <Box sx={{ display: "flex", padding: "6px 12px" }}>
          <PlayCircleOutlineIcon
            sx={{ color: muiTheme.palette.secondary.main, marginRight: "8px" }}
          />
          <Typography color="secondary">
            Trigger can define additional {formatDataTypeName(requestOptionsDataType)} options
          </Typography>
        </Box>
      )}
      {!final &&
        linkedResultOptions.map((lr) => {
          return (
            <Box sx={{ display: "flex", padding: "6px 12px" }} key={lr.resultConfigId + lr.fieldId}>
              <LinkIcon sx={{ color: muiTheme.palette.secondary.main, marginRight: "8px" }} />
              <Typography color="secondary">{linkedResultDescription(lr)}</Typography>
            </Box>
          );
        })}
      {/* </FieldOptionsContainer> */}
    </LabeledGroupedInputs>
  );
};
