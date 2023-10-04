import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { OutlinedInputProps } from "@mui/material/OutlinedInput";

import InputLabel from "@mui/material/InputLabel";
import OutlinedInput from "@mui/material/OutlinedInput";

import { useForm, useFieldArray, Controller, Control } from "react-hook-form";
import z from "zod";

import {
  useSetupProcessWizardState,
  ProcessInput,
  ProcessInputType,
} from "./setupProcessWizard";
import { WizardBody, WizardNav } from "../Shared/Wizard";

const formSchema = z.object({});

type FormFields = z.infer<typeof formSchema>;

interface TextFieldControlProps extends OutlinedInputProps {
  name: string;
  control: Control;
}

const TextFieldControl = ({
  name,
  label,
  control,
  required,
  ...props
}: TextFieldControlProps) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormControl error={Boolean(error)} required={required}>
          <InputLabel htmlFor="component-outlined">{label}</InputLabel>
          <OutlinedInput
            id="component-outlined"
            {...props}
            {...field}
            label={label}
          />
          <FormHelperText
            sx={{
              color: "error.main",
            }}
          >
            {error?.message ?? ""}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
};

interface InputRowProps {
  update: () => void;
  index: number;
  value: ProcessInput;
}

export const ProcessInputs = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } =
    useSetupProcessWizardState();

  const { inputs } = formState;

  const fieldArrayName = "processInputs";

  const { control, handleSubmit } = useForm({
    // resolver: zodResolver(formSchema),
    defaultValues: {
      [fieldArrayName]: inputs,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldArrayName,
  });

  const onSubmit = (data) => {
    setFormState((prev) => ({
      ...prev,
      inputs: [...data.processInputs],
    }));
    onNext();
  };

  return (
    <>
      <WizardBody>
        <form>
          {fields.map((item, index) => {
            console.log("field is ", item);
            const fieldName = `${fieldArrayName}[${index}]`;
            return (
              <fieldset key={item.id}>
                <TextFieldControl
                  name={`${fieldName}.fieldName`}
                  key={"fieldName" + index.toString()}
                  // defaultValue={`${item.fieldName}`}
                  label={"fieldName"}
                  control={control}
                />
                <TextFieldControl
                  name={`${fieldName}.description`}
                  key={"description" + index.toString()}
                  // defaultValue={`${item.description}`}
                  label={"description"}
                  control={control}
                />
                <TextFieldControl
                  name={`${fieldName}.required`}
                  key={"required" + index.toString()}
                  // defaultValue={`${item.required.toString()}`}
                  label={"required"}
                  control={control}
                />
                <TextFieldControl
                  name={`${fieldName}.type`}
                  key={"type" + index.toString()}
                  // defaultValue={`${item.type.toString()}`}
                  label={"type"}
                  control={control}
                />
                <button
                  className="remove"
                  type="button"
                  onClick={() => remove(index)}
                >
                  Remove
                </button>
              </fieldset>
            );
          })}

          <Button
            onClick={() => {
              append({
                fieldName: "",
                description: "",
                required: false,
                type: ProcessInputType.Text,
              });
            }}
          >
            Add
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
