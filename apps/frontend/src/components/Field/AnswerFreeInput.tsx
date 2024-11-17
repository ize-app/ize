import { Box } from "@mui/material";

import { FieldDataType } from "@/graphql/generated/graphql";

import { FreeInputValue } from "./FreeInputValue";

export const AnswerFreeInput = ({
  answer,
  dataType,
}: {
  answer: string;
  dataType: FieldDataType;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: "4px",
        borderRadius: "4px",
        padding: "6px 12px",
        background: "white",
      }}
    >
      <FreeInputValue value={answer} type={dataType} />
    </Box>
  );
};
