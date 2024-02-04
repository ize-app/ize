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
import { RequestInputDataType } from "../types";
import { Checkbox, Select, TextField } from "../../FormFields";
import { LabeledGroupedInputs } from "./LabeledGroupedInputs";

import { requestInputSchema, responseOptionSchema } from "../formSchema";

type RequestInputType = z.infer<typeof requestInputSchema>;

interface RequestInputsFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  requestInputFormMethods: UseFieldArrayReturn<NewFlowFormFields>;
  formIndex: number; // react-hook-form name
}

export const RequestInputsForm = ({
  useFormMethods,
  formIndex,
  requestInputFormMethods,
}: RequestInputsFormProps) => {
  const { control } = useFormMethods;

  const { fields, remove, append } = requestInputFormMethods;

  return (
    <LabeledGroupedInputs label="Request inputs">
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
        <Table aria-label="Request input table" stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell>Input name</TableCell>
              <TableCell align="center">Type</TableCell>
              <TableCell align="center">Required?</TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {fields.map((item, inputIndex) => {
              const noEdit = false; //item.name === "Request title" ? true : false;
              return (
                <TableRow key={item.id}>
                  <TableCell sx={{ minWidth: "150px" }}>
                    <TextField<NewFlowFormFields>
                      name={`steps.${formIndex}.request.inputs.${inputIndex}.name`}
                      key={"name" + inputIndex.toString() + formIndex.toString()}
                      control={control}
                      placeholderText={`Request Input #${inputIndex + 1}`}
                      showLabel={false}
                      label={`Request Input #${inputIndex + 1}`}
                      variant="outlined"
                      disabled={noEdit}
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
                      disabled={noEdit}
                      name={`steps.${formIndex}.request.inputs.${inputIndex}.dataType`}
                      key={"dataType" + inputIndex.toString() + formIndex.toString()}
                      selectOptions={[
                        { name: "Text", value: RequestInputDataType.String },
                        { name: "Number", value: RequestInputDataType.Number },
                        { name: "Url", value: RequestInputDataType.Uri },
                        { name: "Date Time", value: RequestInputDataType.DateTime },
                        { name: "Date", value: RequestInputDataType.Date },
                      ]}
                      label="Type"
                    />
                  </TableCell>
                  <TableCell align="center" sx={{ width: "140px" }}>
                    <Checkbox<NewFlowFormFields>
                      name={`steps.${formIndex}.request.inputs.${inputIndex}.required`}
                      key={"required" + inputIndex.toString() + formIndex.toString()}
                      disabled={noEdit}
                      control={control}
                    />
                  </TableCell>
                  <TableCell>
                    {noEdit ? null : (
                      <IconButton
                        color="primary"
                        aria-label="Remove input option"
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
            required: true,
            dataType: RequestInputDataType.String,
          } as RequestInputType);
        }}
      >
        Add input
      </Button>
    </LabeledGroupedInputs>
  );
};
