import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { FlowSchemaType } from "../../formValidation/flow";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";

import {
  DatePicker,
  DateTimePicker,
  Select,
  Switch,
  TextField,
} from "../../../FormFields";
import { LabeledGroupedInputs } from "../LabeledGroupedInputs";

import { FieldOptionSchemaType } from "../../formValidation/fields";
import { FieldDataType, ResultType } from "@/graphql/generated/graphql";
import { ResponsiveFormRow } from "../ResponsiveFormRow";
import { Box } from "@mui/material";
import { PreviousStepResult } from "../StepForm";

export const defaultOption = (index: number): FieldOptionSchemaType => ({
  optionId: "new." + index,
  name: "",
  dataType: FieldDataType.String,
});

interface RequestInputsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  responseOptionsFormMethods: UseFieldArrayReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  previousStepResult: PreviousStepResult | null;
}

const getResponseLabel = (prevResultType: ResultType) => {
  switch (prevResultType) {
    case ResultType.Decision:
      return "Make decision from last step an option";
    case ResultType.LlmSummary:
      return "Use LLM summary from last step an option";
    case ResultType.Prioritization:
      return "Make prioritized options from last step options";
    case ResultType.Raw:
      return "Make responses from last step options";
    default:
      return "Make result from last step, options in this step";
  }
};

export const ResponseOptionsForm = ({
  formMethods,
  formIndex,
  responseOptionsFormMethods,
  previousStepResult,
}: RequestInputsFormProps) => {
  const { control } = formMethods;
  const { fields, remove, append } = responseOptionsFormMethods;
  const hasRequestDefinedOptions = formMethods.watch(
    `steps.${formIndex}.response.field.optionsConfig.hasRequestOptions`,
  );

  const stepDefinedOptions = formMethods.watch(
    `steps.${formIndex}.response.field.optionsConfig.options`,
  );

  const renderInput = (inputIndex: number, disabled: boolean) => {
    const dataType = formMethods.getValues(
      `steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.dataType`,
    );

    switch (dataType) {
      case FieldDataType.Date:
        return (
          <DatePicker<FlowSchemaType>
            name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      case FieldDataType.DateTime:
        return (
          <DateTimePicker<FlowSchemaType>
            name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      default:
        return (
          <TextField<FlowSchemaType>
            name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            placeholderText={`Option #${inputIndex + 1}`}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
            // variant="outlined"
            disabled={disabled}
            size="small"
            variant="standard"
          />
        );
    }
  };

  return (
    <LabeledGroupedInputs label="Options">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
          padding: "12px",
          alignItems: "flex-start",
          backgroundColor: "#FBF5FD",
        }}
      >
        {formIndex === 0 && (
          <Box sx={{ margin: "16px 0px 0px 16px" }}>
            <ResponsiveFormRow>
              <Switch<FlowSchemaType>
                name={`steps.${formIndex}.response.field.optionsConfig.hasRequestOptions`}
                control={formMethods.control}
                label="Requestor can create options"
              />
              {hasRequestDefinedOptions && (
                <Select
                  control={formMethods.control}
                  width="150px"
                  name={`steps.${formIndex}.response.field.optionsConfig.requestOptionsDataType`}
                  selectOptions={[
                    { name: "Text", value: FieldDataType.String },
                    { name: "Number", value: FieldDataType.Number },
                    { name: "Uri", value: FieldDataType.Uri },
                    { name: "Date", value: FieldDataType.Date },
                    { name: "DateTime", value: FieldDataType.DateTime },
                  ]}
                  label="Option type"
                  size="small"
                  variant="standard"
                  displayLabel={false}
                />
              )}
            </ResponsiveFormRow>
            {formIndex > 0 && previousStepResult && (
              <ResponsiveFormRow>
                <Switch<FlowSchemaType>
                  name={`steps.${formIndex}.response.field.optionsConfig.previousStepOptions`}
                  control={formMethods.control}
                  width="100%"
                  label={getResponseLabel(previousStepResult.resultType)}
                />
              </ResponsiveFormRow>
            )}
          </Box>
        )}
        {stepDefinedOptions.length > 0 && (
          <TableContainer
            sx={{
              overflowX: "auto",
              maxWidth: "1000px",
              padding: "0px",
              "& .MuiTableCell-root": {
                padding: "0px",
                border: "none",
              },
            }}
          >
            <Table aria-label="Response options table" stickyHeader={true}>
              <TableBody>
                {fields.map((item, inputIndex) => {
                  return (
                    <TableRow key={item.id}>
                      {/* Need to add a hidden option ID text field so that default values propogate correctly */}
                      <TableCell
                        align="center"
                        sx={{
                          display: "none",
                        }}
                      >
                        <TextField<FlowSchemaType>
                          name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.optionId`}
                          key={"optionId" + inputIndex.toString() + formIndex.toString()}
                          control={control}
                          showLabel={false}
                          label={`Option ID - ignore`}
                          variant="standard"
                          disabled={true}
                          size="small"
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          width: "160px",
                        }}
                      >
                        <Select<FlowSchemaType>
                          control={control}
                          width="120px"
                          displayLabel={false}
                          size={"small"}
                          name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.dataType`}
                          key={"dataType" + inputIndex.toString() + formIndex.toString()}
                          selectOptions={[
                            { name: "Text", value: FieldDataType.String },
                            { name: "Number", value: FieldDataType.Number },
                            { name: "Url", value: FieldDataType.Uri },
                            { name: "Date Time", value: FieldDataType.DateTime },
                            { name: "Date", value: FieldDataType.Date },
                          ]}
                          label="Type"
                          variant="standard"
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: "150px" }}>
                        {renderInput(inputIndex, false)}
                      </TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          aria-label="Remove option"
                          onClick={() => remove(inputIndex)}
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
        )}

        <Button
          sx={{ margin: "0px 0px 8px 16px", position: "relative", bottom: "8px" }}
          variant="outlined"
          onClick={() => {
            append(defaultOption(stepDefinedOptions.length));
          }}
        >
          Add option
        </Button>
      </Box>
    </LabeledGroupedInputs>
  );
};
