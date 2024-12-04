import { Close } from "@mui/icons-material";
import { Box, IconButton, Typography } from "@mui/material";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { Dispatch, SetStateAction } from "react";
import { UseFieldArrayReturn, useFormContext } from "react-hook-form";

import { AddResultButton } from "./AddResultButton";
import { FlowSchemaType } from "../../formValidation/flow";
import { getResultFormLabel } from "../../helpers/getResultFormLabel";

export default function ResultsToggle({
  stepIndex,
  resultIndex,
  setResultIndex,
  locked,
  fieldsArrayMethods,
  resultsArrayMethods,
}: {
  stepIndex: number;
  resultIndex: number;
  setResultIndex: Dispatch<SetStateAction<number>>;
  locked: boolean;
  fieldsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
  resultsArrayMethods: UseFieldArrayReturn<FlowSchemaType>;
}) {
  const { getValues, formState } = useFormContext<FlowSchemaType>();

  const results = getValues(`steps.${stepIndex}.result`);

  const handleChange = (_event: React.MouseEvent<HTMLElement>, nextResultIndex: number | null) => {
    if (nextResultIndex !== null) setResultIndex(nextResultIndex);
  };

  return (
    <ToggleButtonGroup
      color="primary"
      orientation="vertical"
      value={resultIndex}
      exclusive
      onChange={handleChange}
      sx={{ width: "100%", maxWidth: "300px" }}
    >
      {results.map((result, index) => {
        const resultField = getValues(`steps.${stepIndex}.fieldSet.fields.${index}`);
        const hasError =
          !!formState.errors.steps?.[stepIndex]?.fieldSet?.fields?.[index] ||
          !!formState.errors.steps?.[stepIndex]?.result?.[index];
        return (
          <Box sx={{ display: "flex" }} key={"resultToggle" + result.resultConfigId}>
            <ToggleButton
              // sx={{ width: "240px", padding: "7px" }}
              value={index}
              aria-label="list"
              // color={hasError ? "error" : "primary"}
              sx={(theme) => ({
                padding: "7px",
                display: "flex",
                flexDirection: "column",
                width: "100%",
                outline: hasError ? `1px solid ${theme.palette.error.main}` : "inherit",

                // backgroundColor: hasError ? theme.palette.error.light : "inherit",
                color: hasError ? theme.palette.error.main : "inherit",
              })}
            >
              <Typography
                variant="label"
                sx={(theme) => ({
                  color: hasError ? theme.palette.error.main : "inherit",
                })}
              >
                {getResultFormLabel({ result })}
              </Typography>
              <Typography
                variant="description"
                fontWeight={400}
                sx={{
                  // color: hasError ? theme.palette.error.main : "inherit",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: "1",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {resultField.name}
              </Typography>
            </ToggleButton>
            {!locked && (
              <IconButton
                // color={"primary"}
                size="small"
                aria-label="Remove result"
                onClick={(_e) => {
                  resultsArrayMethods.remove(resultIndex);
                  fieldsArrayMethods.remove(resultIndex);
                  setResultIndex(0);
                }}
                sx={{
                  display: "flex",
                  alignSelf: "right",
                  flexShrink: 0, // Prevents the button from shrinking
                }}
              >
                <Close fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      })}
      <AddResultButton
        fieldsArrayMethods={fieldsArrayMethods}
        resultsArrayMethods={resultsArrayMethods}
        setResultIndex={setResultIndex}
      />
    </ToggleButtonGroup>
  );
}
