import { Box } from "@mui/material";

import { FieldDataType } from "@/graphql/generated/graphql";

import { FreeInputValue } from "./FreeInputValue";

export const AnswerOptionSelections = ({
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
        outline: "1px solid rgba(0, 0, 0, 0.1)",
        padding: "6px",
      }}
    >
      <FreeInputValue value={answer} type={dataType} />
    </Box>
  );
};
