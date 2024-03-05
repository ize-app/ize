import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { FlowSchemaType } from "../../formValidation/flow";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { DatePicker, DateTimePicker, Select, Switch, TextField } from "../../../FormFields";
import { LabeledGroupedInputs } from "../../../LabeledGroupedInputs";

import {
  DefaultFieldSelection,
  FieldOptionSchemaType,
  FieldsSchemaType,
} from "../../formValidation/fields";
import { DecisionType, FieldDataType, ResultType } from "@/graphql/generated/graphql";
import { ResponsiveFormRow } from "../ResponsiveFormRow";
import { Box, FormHelperText } from "@mui/material";
import { ResultSchemaType } from "../../formValidation/result";
import { SelectOption } from "../../../FormFields/Select";

export const defaultResult: ResultSchemaType = {
  type: ResultType.Decision,
  minimumResponses: 1,
  decision: {
    type: DecisionType.NumberThreshold,
    threshold: 1,
  },
};

interface ResultsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
}

const createResultFieldOptions = (
  resultType: ResultType,
  responseFields: FieldsSchemaType,
): SelectOption[] => {
  const defaultSelection: SelectOption = { name: "All fields", value: DefaultFieldSelection.None };

  switch (resultType) {
    case ResultType.Decision: {
      return [defaultSelection];
    }
    default:
      return [defaultSelection];
  }
};

export const ResultsForm = ({ formMethods, formIndex }: ResultsFormProps) => {
  const { control, watch } = formMethods;

  const { fields, remove, append } = useFieldArray({
    control: formMethods.control,
    //@ts-ignore
    name: `steps.${formIndex}.results`,
  });

  const results = watch(`steps.${formIndex}.results`) ?? [];
  const responseFields = watch(`steps.${formIndex}.response.fields`) ?? [];

  return results.length > 0 ? (
    <LabeledGroupedInputs label="Result">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          alignItems: "flex-start",
          backgroundColor: "#FBF5FD",
        }}
      >
        <TableContainer
          sx={{
            overflowX: "auto",
            // maxWidth: "1000px",
            padding: "0px",
            "& .MuiTableCell-root": {
              padding: "0px",
              border: "none",
            },
          }}
        >
          <Table aria-label="Response options table" stickyHeader={true}>
            <TableBody>
              {fields.map((item, resultIndex) => {
                const resultType: ResultType = formMethods.watch(
                  `steps.${formIndex}.results.${resultIndex}.type`,
                );
                return (
                  <TableRow key={item.id}>
                    {/* Need to add a hidden option ID text field so that default values propogate correctly */}
                    <TableCell
                      align="center"
                      sx={{
                        display: "none",
                      }}
                    >
                      {/* <TextField<FlowSchemaType>
                          //@ts-ignore
                          name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.optionId`}
                          key={"optionId" + inputIndex.toString() + formIndex.toString()}
                          control={control}
                          showLabel={false}
                          label={`Option ID - ignore`}
                          variant="standard"
                          disabled={true}
                          size="small"
                        /> */}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        width: "160px",
                      }}
                    >
                      <Select<FlowSchemaType>
                        control={formMethods.control}
                        label="What's the final result?"
                        width="300px"
                        selectOptions={[
                          { name: "Decision", value: ResultType.Decision },
                          { name: "Prioritized options", value: ResultType.Ranking },
                          { name: "AI summary", value: ResultType.LlmSummary },
                        ]}
                        name={`steps.${formIndex}.results.${resultIndex}.type`}
                        size="small"
                        displayLabel={false}
                      />
                    </TableCell>
                    <TableCell sx={{ minWidth: "150px" }}>
                      <Select<FlowSchemaType>
                        control={formMethods.control}
                        label="Field"
                        width="300px"
                        selectOptions={createResultFieldOptions(resultType, responseFields)}
                        name={`steps.${formIndex}.results.${resultIndex}.fieldId`}
                        size="small"
                        displayLabel={false}
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        aria-label="Remove option"
                        onClick={() => remove(resultIndex)}
                      >
                        <HighlightOffOutlined />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Button
          sx={{ margin: "0px 0px 8px 16px", position: "relative", bottom: "8px" }}
          variant="outlined"
          onClick={() => {
            append(defaultResult);
          }}
        >
          Add result
        </Button>
        {/* <FormHelperText
          sx={{
            color: "error.main",
            marginLeft: "16px",
          }}
        >
          {optionsError}
        </FormHelperText> */}
      </Box>
    </LabeledGroupedInputs>
  ) : (
    <Button
      sx={{ position: "relative", bottom: "8px" }}
      variant="outlined"
      onClick={() => {
        append(defaultResult);
      }}
    >
      Add result
    </Button>
  );
};
