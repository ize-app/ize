import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import * as z from "zod";

import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { InputDataType } from "../types";
import { Checkbox, DatePicker, DateTimePicker, Select, TextField } from "../../FormFields";
import { LabeledGroupedInputs } from "./LabeledGroupedInputs";

import { FieldOptionSchemaType } from "../formValidation/fields";
import { FieldDataType } from "@/graphql/generated/graphql";

export const defaultOption: FieldOptionSchemaType = {
  optionId: "",
  name: "",
  dataType: FieldDataType.String,
};

interface RequestInputsFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  responseOptionsFormMethods: UseFieldArrayReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

export const ResponseOptionsForm = ({
  useFormMethods,
  formIndex,
  responseOptionsFormMethods,
}: RequestInputsFormProps) => {
  const { control } = useFormMethods;
  const { fields, remove, append } = responseOptionsFormMethods;
  const options = useFormMethods.watch(`steps.${formIndex}.response.field.optionsConfig.options`);

  const renderInput = (inputIndex: number, disabled: boolean) => {
    const dataType = useFormMethods.getValues(
      `steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.dataType`,
    );

    switch (dataType) {
      case FieldDataType.Date:
        return (
          <DatePicker<NewFlowFormFields>
            name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      case FieldDataType.DateTime:
        return (
          <DateTimePicker<NewFlowFormFields>
            name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      default:
        return (
          <TextField<NewFlowFormFields>
            name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            placeholderText={`Option #${inputIndex + 1}`}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
            variant="outlined"
            disabled={disabled}
            size="small"
          />
        );
    }
  };

  return (
    <LabeledGroupedInputs label="Options">
      <TableContainer
        sx={{
          overflowX: "auto",
          maxWidth: "1000px",
          padding: "20px 16px 16px",
          "& .MuiTableCell-root": {
            padding: "4px",
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
                    <TextField<NewFlowFormFields>
                      name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.optionId`}
                      key={"optionId" + inputIndex.toString() + formIndex.toString()}
                      control={control}
                      showLabel={false}
                      label={`Option ID - ignore`}
                      variant="outlined"
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
                    <Select<NewFlowFormFields>
                      control={control}
                      width="120px"
                      displayLabel={false}
                      size={"small"}
                      name={`steps.${formIndex}.response.field.optionsConfig.options.${inputIndex}.dataType`}
                      key={"dataType" + inputIndex.toString() + formIndex.toString()}
                      selectOptions={[
                        { name: "Text", value: InputDataType.String },
                        { name: "Number", value: InputDataType.Number },
                        { name: "Url", value: InputDataType.Uri },
                        { name: "Date Time", value: InputDataType.DateTime },
                        { name: "Date", value: InputDataType.Date },
                      ]}
                      label="Type"
                    />
                  </TableCell>
                  <TableCell sx={{ minWidth: "150px" }}>{renderInput(inputIndex, false)}</TableCell>
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

      <Button
        sx={{ margin: "0px 0px 8px 16px", position: "relative", bottom: "8px" }}
        variant="outlined"
        onClick={() => {
          append(defaultOption);
        }}
      >
        Add option
      </Button>
    </LabeledGroupedInputs>
  );
};
