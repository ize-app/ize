import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { Box, useFormControl } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { StepForm } from "./StepForm";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
}

export const StepsForm = ({ useFormMethods }: StepFormProps) => {
  const fieldArrayName = "steps";

  const stepsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    name: fieldArrayName,
  });

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {stepsArrayMethods.fields.map((item, index) => {
        return (
          <StepForm
            id={item.id}
            useFormMethods={useFormMethods}
            formIndex={index}
            //@ts-ignore
            stepsArrayMethods={stepsArrayMethods}
            key={"step" + index.toString()}
          />
        );
      })}
    </Box>
  );
};
