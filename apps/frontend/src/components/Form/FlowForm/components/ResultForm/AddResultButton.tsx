import { Box, Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { UseFieldArrayReturn } from "react-hook-form";

import { FieldOptionsSelectionType, FieldType, ResultType } from "@/graphql/generated/graphql";

import { FieldSchemaType } from "../../formValidation/fields";
import { FlowSchemaType } from "../../formValidation/flow";
import { ResultSchemaType } from "../../formValidation/result";
import { createDefaultFieldState } from "../../helpers/defaultFormState/createDefaultFieldState";
import { createDefaultResultState } from "../../helpers/defaultFormState/createDefaultResultState";

export const AddResultButton = ({
  fieldsArrayMethods,
  resultsArrayMethods,
}: {
  fieldsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  resultsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const addResult = ({ resultType }: { resultType: ResultType }) => {
    // e.stopPropagation();
    const field: FieldSchemaType = createDefaultFieldState({
      fieldType:
        resultType === ResultType.Ranking || resultType === ResultType.Decision
          ? FieldType.Options
          : FieldType.FreeInput,
      selectionType:
        resultType === ResultType.Ranking
          ? FieldOptionsSelectionType.Rank
          : FieldOptionsSelectionType.Select,
    });
    const result: ResultSchemaType = createDefaultResultState({
      resultType,
      fieldId: field.fieldId,
    });
    fieldsArrayMethods.append(field);
    resultsArrayMethods.append(result);
    handleClose();
  };

  return (
    <Box>
      <Button sx={{ flexGrow: 0 }} variant="outlined" size="small" onClick={handleClick}>
        Add result
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        autoFocus={false}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <MenuItem onClick={() => addResult({ resultType: ResultType.Decision })}>Decision</MenuItem>
        <MenuItem onClick={() => addResult({ resultType: ResultType.Ranking })}>
          Prioritized list
        </MenuItem>
        <MenuItem onClick={() => addResult({ resultType: ResultType.LlmSummary })}>
          AI generated summary
        </MenuItem>
        <MenuItem onClick={() => addResult({ resultType: ResultType.LlmSummaryList })}>
          AI generated list
        </MenuItem>
      </Menu>
    </Box>
  );
};
