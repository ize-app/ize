import { Box, useFormControl } from "@mui/material";
import { UseFormReturn, useFieldArray } from "react-hook-form";
import { StepForm } from "./StepForm";
import { useState } from "react";
import { FlowSchemaType } from "../formValidation/flow";
import { EvolveProcessForm } from "./EvolveFlowForm";

interface StepFormProps {
  useFormMethods: UseFormReturn<FlowSchemaType>;
}

export const StepsForm = ({ useFormMethods }: StepFormProps) => {
  const fieldArrayName = "steps";

  const stepsArrayMethods = useFieldArray({
    control: useFormMethods.control,
    name: fieldArrayName,
  });

  const [expanded, setExpanded] = useState<number | "EvolveStep" | false>(0);

  const handleStepExpansion =
    (stepIdentifier: number | "EvolveStep") =>
    (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? stepIdentifier : false);
    };

  const isReusable = useFormMethods.watch(`reusable`);

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
      {isReusable && (
        <EvolveProcessForm
          formMethods={useFormMethods}
          expandedStep={expanded}
          handleStepExpansion={handleStepExpansion("EvolveStep")}
        />
      )}
    </Box>
  );
};
