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

import { responseOptionSchema } from "../formSchema";

type ResponseOptionType = z.infer<typeof responseOptionSchema>;

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
  const dataType = useFormMethods.watch(`steps.${formIndex}.respond.inputs.options.dataType`);

  const renderInput = (inputIndex: number, disabled: boolean) => {
    switch (dataType) {
      case InputDataType.Date:
        return (
          <DatePicker<NewFlowFormFields>
            name={`steps.${formIndex}.respond.inputs.options.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      case InputDataType.DateTime:
        return (
          <DateTimePicker<NewFlowFormFields>
            name={`steps.${formIndex}.respond.inputs.options.options.${inputIndex}.name`}
            key={"name" + inputIndex.toString() + formIndex.toString()}
            control={control}
            showLabel={false}
            label={`Option #${inputIndex + 1}`}
          />
        );
      default:
        return (
          <TextField<NewFlowFormFields>
            name={`steps.${formIndex}.respond.inputs.options.options.${inputIndex}.name`}
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
              const cannotDelete = inputIndex < 2;

              return (
                <TableRow key={item.id}>
                  <TableCell sx={{ minWidth: "150px" }}>{renderInput(inputIndex, false)}</TableCell>
                  <TableCell>
                    {cannotDelete ? null : (
                      <IconButton
                        color="primary"
                        aria-label="Remove option"
                        onClick={() => remove(inputIndex)}
                      >
                        <HighlightOffOutlined />
                      </IconButton>
                    )}
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
          append({
            name: "",
          } as ResponseOptionType);
        }}
      >
        Add input
      </Button>
    </LabeledGroupedInputs>
  );
};
