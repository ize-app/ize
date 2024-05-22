import { FieldDataType, FieldOptionsSelectionType } from "@/graphql/generated/graphql";
import { SxProps, Typography } from "@mui/material";
import { renderFreeInputValue } from "./renderFreeInputValue";

export const FieldOption = ({
  isSelected = false,
  value,
  dataType,
  selectionType,
  index,
  sx = {},
}: {
  isSelected?: boolean;
  value: string;
  dataType: FieldDataType;
  selectionType: FieldOptionsSelectionType;
  index: number | null;
  sx?: SxProps;
}) => {
  return (
    <Typography
      sx={{
        backgroundColor: isSelected ? "#ffffe6" : "inherit",
        padding: "6px 12px",
        display: "flex",
        ...sx,
      }}
      component={"li"}
      border={isSelected && selectionType !== FieldOptionsSelectionType.Rank ? "1px solid" : "none"}
      fontWeight={isSelected ? 500 : "normal"}
      color={isSelected ? "primary" : "secondary"}
      fontSize={".875rem"}
    >
      {selectionType === FieldOptionsSelectionType.Rank && (
        <Typography fontSize={".875rem"} fontWeight={700} marginRight="4px">
          {index}.
        </Typography>
      )}
      {renderFreeInputValue(value, dataType)}
    </Typography>
  );
};
