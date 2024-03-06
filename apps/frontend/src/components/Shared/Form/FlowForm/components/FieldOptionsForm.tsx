import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import { FlowSchemaType } from "../formValidation/flow";
import { UseFormReturn, useFieldArray } from "react-hook-form";

import { DatePicker, DateTimePicker, Select, Switch, TextField } from "../../FormFields";
import { LabeledGroupedInputs } from "../../LabeledGroupedInputs";

import { FieldOptionSchemaType } from "../formValidation/fields";
import { FieldDataType } from "@/graphql/generated/graphql";
import { ResponsiveFormRow } from "./ResponsiveFormRow";
import { Box, FormHelperText } from "@mui/material";

export const defaultOption = (index: number): FieldOptionSchemaType => ({
  optionId: "new." + index,
  name: "",
  dataType: FieldDataType.String,
});

interface FieldOptionsFormProps {
  formMethods: UseFormReturn<FlowSchemaType>;
  formIndex: number; // react-hook-form name
  fieldIndex: number;
  branch: "request" | "response";
}

export const FieldOptionsForm = ({
  formMethods,
  formIndex,
  branch,
  fieldIndex,
}: FieldOptionsFormProps) => {
  const { control } = formMethods;

  const { fields, remove, append } = useFieldArray({
    control: formMethods.control,
    //@ts-ignore
    name: `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options`,
  });

  const hasRequestDefinedOptions = formMethods.watch(
    //@ts-ignore
    `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`,
  );

  const stepDefinedOptions =
    //@ts-ignore
    formMethods.watch(`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options`) ??
    [];

  const optionsError =
    formMethods.getFieldState(`steps.${formIndex}.${branch}.fields.${fieldIndex}`).error?.message ??
    "";

  const renderInput = (inputIndex: number, disabled: boolean) => {
    const dataType = formMethods.getValues(
      //@ts-ignore
      `steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.dataType`,
    );

    switch (dataType) {
      case FieldDataType.Date:
        return (
          <DatePicker<FlowSchemaType>
            //@ts-ignore
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      case FieldDataType.DateTime:
        return (
          <DateTimePicker<FlowSchemaType>
            //@ts-ignore
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      default:
        return (
          <TextField<FlowSchemaType>
            //@ts-ignore
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            placeholderText={`Option #${inputIndex + 1}`}
            showLabel={false}
            width="300px"
            flexGrow="1"
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
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        alignItems: "flex-start",
        padding: "0px 30px",
        width: "80%",
      }}
    >
      {formIndex === 0 && (
        <ResponsiveFormRow>
          <Switch<FlowSchemaType>
            //@ts-ignore
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.hasRequestOptions`}
            control={formMethods.control}
            label="Requestor can create options"
          />
          {hasRequestDefinedOptions && (
            <Select
              control={formMethods.control}
              width="150px"
              //@ts-ignore
              name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.requestOptionsDataType`}
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
      )}
      {formIndex > 0 && (
        <ResponsiveFormRow>
          <Switch<FlowSchemaType>
            //@ts-ignore
            name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.previousStepOptions`}
            control={formMethods.control}
            width="100%"
            label={"Use previous step results"}
          />
        </ResponsiveFormRow>
      )}
      {stepDefinedOptions.length > 0 && (
        <Box sx={{ width: "100%" }}>
          {fields.map((item, inputIndex) => {
            return (
              <ResponsiveFormRow>
                <Box sx={{ display: "none" }}>
                  <TextField<FlowSchemaType>
                    //@ts-ignore
                    name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.optionId`}
                    key={"optionId" + inputIndex.toString() + formIndex.toString()}
                    control={control}
                    showLabel={false}
                    label={`Option ID - ignore`}
                    variant="standard"
                    disabled={true}
                    size="small"
                  />
                </Box>
                <Select<FlowSchemaType>
                  control={control}
                  width="120px"
                  displayLabel={false}
                  size={"small"}
                  //@ts-ignore
                  name={`steps.${formIndex}.${branch}.fields.${fieldIndex}.optionsConfig.options.${inputIndex}.dataType`}
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

                {renderInput(inputIndex, false)}
                <IconButton
                  color="primary"
                  aria-label="Remove option"
                  onClick={() => remove(inputIndex)}
                >
                  <HighlightOffOutlined />
                </IconButton>
              </ResponsiveFormRow>
            );
          })}
        </Box>
      )}

      <Button
        sx={{ position: "relative" }}
        variant="outlined"
        size="small"
        onClick={() => {
          append(defaultOption(stepDefinedOptions.length));
        }}
      >
        Add option
      </Button>
      <FormHelperText
        sx={{
          color: "error.main",
          marginLeft: "16px",
        }}
      >
        {optionsError}
      </FormHelperText>
    </Box>
  );
};
