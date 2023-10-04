import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

import HighlightOffOutlined from "@mui/icons-material/HighlightOffOutlined";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
import z from "zod";

import {
  CheckboxControlled,
  TextFieldControl,
  SelectControlled,
} from "../Shared/Form";
import {
  useSetupProcessWizardState,
  ProcessInputType,
} from "./setupProcessWizard";
import { WizardBody, WizardNav } from "../Shared/Wizard";
import { Typography } from "@mui/material";

const fieldArrayName = "processInputs";

const rowSchema = z.object({
  fieldName: z.string().nonempty(),
  description: z.string().nonempty(),
  required: z.boolean(),
  type: z.nativeEnum(ProcessInputType),
});

const formSchema = z.object({ [fieldArrayName]: z.array(rowSchema) });

type FormFields = z.infer<typeof formSchema>;

export const ProcessInputs = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useSetupProcessWizardState();

  const { inputs } = formState;

  const intitialFormState = inputs ? [...inputs] : [];
  if (intitialFormState.length === 0)
    intitialFormState.push({
      fieldName: "Request title",
      description: "Brief summary of request",
      required: true,
      type: ProcessInputType.Text,
    });

  const { control, handleSubmit } = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      [fieldArrayName]: intitialFormState,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName,
  });

  const onSubmit = (data: FormFields) => {
    setFormState((prev) => ({
      ...prev,
      inputs: [...data.processInputs],
    }));
    onNext();
  };

  return (
    <>
      <WizardBody>
        <Typography variant="body1">
          This process is triggered by creating a{" "}
          <span style={{ fontWeight: "bold" }}>request</span>. You can define
          whether this process needs certain information to be triggered via{" "}
          <span style={{ fontWeight: "bold" }}>input fields</span>. Input fields
          help keep proposals consistent and make it easier to build
          integrations with other tools. <br />
          <br />
          For example, a “Reimburse expense” process might have a required
          “Amount” field on each proposal. <br />
        </Typography>
        <form>
          <TableContainer sx={{ overflowX: "auto" }}>
            <Table aria-label="input table" stickyHeader={true}>
              <TableHead>
                <TableRow>
                  <TableCell>Input name</TableCell>
                  <TableCell align="center">Input type</TableCell>
                  <TableCell align="center">Required?</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell />
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((item, index) => {
                  const fieldName = `${fieldArrayName}[${index}]`;
                  const noEdit =
                    item.fieldName === "Request title" ? true : false;
                  return (
                    <TableRow key={item.id}>
                      <TableCell sx={{ minWidth: "150px" }}>
                        <TextFieldControl
                          name={`${fieldName}.fieldName`}
                          key={"fieldName" + index.toString()}
                          fullWidth
                          disabled={noEdit}
                          control={control}
                        />
                      </TableCell>
                      <TableCell sx={{ width: "120px" }}>
                        <SelectControlled
                          name={`${fieldName}.type`}
                          selectOptions={Object.values(ProcessInputType)}
                          key={"type" + index.toString()}
                          sx={{ width: "120px" }}
                          disabled={noEdit}
                          control={control}
                        />
                      </TableCell>
                      <TableCell align="center">
                        <CheckboxControlled
                          name={`${fieldName}.required`}
                          key={"required" + index.toString()}
                          disabled={noEdit}
                          control={control}
                        />
                      </TableCell>
                      <TableCell sx={{ minWidth: "200px" }}>
                        <TextFieldControl
                          name={`${fieldName}.description`}
                          key={"description" + index.toString()}
                          fullWidth
                          disabled={noEdit}
                          control={control}
                        />
                      </TableCell>
                      <TableCell>
                        {noEdit ? null : (
                          <IconButton
                            color="primary"
                            aria-label="Remove input option"
                            onClick={() => remove(index)}
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
                fieldName: "",
                description: "",
                required: true,
                type: ProcessInputType.Text,
              });
            }}
          >
            Add input
          </Button>
        </form>
      </WizardBody>
      <WizardNav
        onNext={handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
