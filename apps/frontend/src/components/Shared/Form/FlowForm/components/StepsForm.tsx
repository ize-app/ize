import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { useFormControl } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { StepForm } from "./StepForm";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
}

export const StepsForm = ({ useFormMethods }: StepFormProps) => {
  const fieldArrayName = "steps";

  const { fields, append, remove } = useFieldArray({
    control: useFormMethods.control,
    name: fieldArrayName,
  });
  return (
    <div>
      {fields.map((item, index) => {
        // const name = `${fieldArrayName}[${index}]`;
        return (
          <StepForm
            useFormMethods={useFormMethods}
            formIndex={index}
            key={"name" + index.toString()}
          />
        );
      })}
    </div>
  );
};
