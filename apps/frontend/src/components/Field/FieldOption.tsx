import { Box, Typography } from "@mui/material";

import {
  OptionSelectionType,
  ResponseFieldAnswersOptionsSummaryFragment,
  ValueFragment,
} from "@/graphql/generated/graphql";

import { OptionResponseSummary } from "./OptionResponseSummary";
import { Value } from "../Value/Value";

// amdmittedly, this component is kind of convulted. due for a refactor
export const FieldOption = ({
  isSelected = false,
  value,
  selectionType,
  index,
  final,
  optionResponseSummary,
  totalResponses,
}: {
  isSelected?: boolean;
  value: ValueFragment;
  selectionType: OptionSelectionType;
  index: number | null;
  final: boolean;
  optionResponseSummary?: ResponseFieldAnswersOptionsSummaryFragment | null | undefined;
  totalResponses?: number;
}) => {
  const votes = optionResponseSummary?.count || 0;
  const percentage =
    totalResponses && totalResponses > 0 && selectionType !== OptionSelectionType.Rank
      ? parseFloat(((votes / totalResponses) * 100).toFixed(0))
      : 0;
  const avgRank = optionResponseSummary?.rank || 0;
  return (
    <Box
      component={"li"}
      sx={(theme) => ({
        display: "flex",
        flexDirection: "column",
        backgroundColor: isSelected ? "#ffffe6" : "inherit",
        border:
          isSelected && selectionType !== OptionSelectionType.Rank
            ? `1px solid ${theme.palette.primary.main}`
            : "none",
      })}
    >
      <Box sx={{ padding: "6px 6px 2px", display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{ display: "flex" }}
          fontWeight={isSelected ? 500 : "normal"}
          color={isSelected ? "primary" : "secondary"}
          fontSize={"1rem"}
        >
          {selectionType === OptionSelectionType.Rank && typeof index === "number" && final && (
            <Typography fontSize={"1rem"} fontWeight={700} marginRight="4px" color="primary">
              {index + 1}.
            </Typography>
          )}
          <Value value={value} type="option" />
        </Box>
        {!!percentage && (
          <Typography sx={{ width: "80px" }} textAlign={"right"}>
            {votes} ({percentage}%)
          </Typography>
        )}
        {!!avgRank && (
          <Typography sx={{ width: "80px" }} textAlign={"right"}>
            {avgRank}
          </Typography>
        )}
      </Box>
      {!!percentage && (totalResponses ?? 0) > 1 && (
        <OptionResponseSummary percentage={percentage} />
      )}
    </Box>
  );
};
