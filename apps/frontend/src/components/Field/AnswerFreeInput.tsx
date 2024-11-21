import { Box, SxProps } from "@mui/material";

import { FieldDataType } from "@/graphql/generated/graphql";

import { FreeInputValue } from "./FreeInputValue";

export const AnswerFreeInput = ({
  answer,
  dataType,
  sx = {},
}: {
  answer: string;
  dataType: FieldDataType;
  sx?: SxProps;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "4px",
        borderRadius: "4px",
        background: "white",
        ...sx,
      }}
    >
      <FreeInputValue value={answer} type={dataType} />
    </Box>
  );
};
