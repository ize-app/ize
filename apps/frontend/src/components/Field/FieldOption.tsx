import { SxProps, Typography } from "@mui/material";

import { FieldDataType, FieldOptionsSelectionType } from "@/graphql/generated/graphql";

import { FreeInputValue } from "./FreeInputValue";

// amdmittedly, this component is kind of convulted. due for a refactor
export const FieldOption = ({
  isSelected = false,
  value,
  dataType,
  selectionType,
  index,
  final,
  sx = {},
}: {
  isSelected?: boolean;
  value: string;
  dataType: FieldDataType;
  selectionType: FieldOptionsSelectionType;
  index: number | null;
  final: boolean;
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
      fontSize={"1rem"}
    >
      {selectionType === FieldOptionsSelectionType.Rank && typeof index === "number" && final && (
        <Typography fontSize={"1rem"} fontWeight={700} marginRight="4px">
          {index + 1}.
        </Typography>
      )}
      <FreeInputValue value={value} type={dataType} />
    </Typography>
  );
};
