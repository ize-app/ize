import { FieldDataType } from "@/graphql/generated/graphql";
import { SxProps, Typography } from "@mui/material";
import { renderFreeInputValue } from "./renderFreeInputValue";

export const FieldOption = ({
  isSelected = false,
  value,
  dataType,
  sx = {},
}: {
  isSelected?: boolean;
  value: string;
  dataType: FieldDataType;
  sx?: SxProps;
}) => {
  return (
    <Typography
      sx={{
        backgroundColor: isSelected ? "#ffffe6" : "inherit",
        padding: "6px 12px",
        ...sx,
      }}
      component={"li"}
      border={isSelected ? "1px solid" : "none"}
      fontWeight={isSelected ? 500 : "normal"}
      color={isSelected ? "primary" : "secondary"}
      fontSize={".875rem"}
    >
      {renderFreeInputValue(value, dataType)}
    </Typography>
  );
};
