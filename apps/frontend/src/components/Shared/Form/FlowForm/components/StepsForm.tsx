import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { Box, useFormControl } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { StepForm } from "./StepForm";
import { useState } from "react";

interface StepFormProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
}

export const StepsForm = ({ useFormMethods }: StepFormProps) => {
  const fieldArrayName = "steps";

  const stepsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    name: fieldArrayName,
  });

  const [expanded, setExpanded] = useState<number | false>(0);

  const handleStepExpansion =
    (stepIndex: number) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? stepIndex : false);
    };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: "36px" }}>
      {stepsArrayMethods.fields.map((item, index) => {
        return (
          <StepForm
            id={item.id}
            useFormMethods={useFormMethods}
            formIndex={index}
            expandedStep={expanded}
            handleStepExpansion={handleStepExpansion(index)}
            //@ts-ignore
            stepsArrayMethods={stepsArrayMethods}
            key={"step" + index.toString()}
          />
        );
      })}
    </Box>
  );
};
