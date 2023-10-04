import Button from "@mui/material/Button";

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
    console.log("data is ", data);
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
                <CheckboxControlled
                  name={`${fieldName}.required`}
                  key={"required" + index.toString()}
                  // defaultValue={`${item.required.toString()}`}
                  label={"required"}
                  control={control}
                />
                <SelectControlled
                  name={`${fieldName}.type`}
                  selectOptions={Object.values(ProcessInputType)}
                  key={"type" + index.toString()}
                  // defaultValue={`${item.type.toString()}`}
                  label={"type"}
                  sx={{ width: "120px" }}
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
