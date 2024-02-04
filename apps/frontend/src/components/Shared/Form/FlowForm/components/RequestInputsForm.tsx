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

import { Box } from "@mui/material";
import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { RequestInputDataType } from "../types";
import { Checkbox, Select, TextField } from "../../FormFields";

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
    <Box
      sx={{
        width: "100%",
        border: "solid 1px",
        borderColor: "rgba(0, 0, 0, 0.23)",
        borderRadius: "4px",
      }}
    >
      <fieldset
        style={{
          position: "relative",
          left: 0,
          bottom: 0,
          right: 0,
          top: "-12px",
          border: "none",
          lineHeight: "23px",
          minWidth: "0%",
        }}
      >
        <legend>
          <span
            style={{
              padding: "0px 5px",
              backgroundColor: "white",
              fontWeight: "400",
              fontFamily: "roboto",
              color: "rgba(0, 0, 0, 0.6)",
              fontSize: "1rem",
            }}
          >
            Request options
          </span>
        </legend>
      </fieldset>
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table aria-label="input table" stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell>Input name</TableCell>
              <TableCell align="center">Input type</TableCell>
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
                      placeholderText=""
                      label="Request Input #1"
                      variant="outlined"
                      disabled={noEdit}
                    />
                  </TableCell>
                  <TableCell sx={{ width: "120px" }}>
                    <Select<NewFlowFormFields>
                      control={control}
                      width="400px"
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
                  <TableCell align="center">
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
        sx={{ marginTop: "16px", marginLeft: "16px" }}
        variant="outlined"
        onClick={() => {
          append({
            id: "new",
            name: "",
            required: true,
            dataType: RequestInputDataType.String,
          });
        }}
      >
        Add input
      </Button>
    </Box>
  );
};
