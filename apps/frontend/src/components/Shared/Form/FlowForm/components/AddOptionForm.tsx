import { NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";
import { UseFormReturn } from "react-hook-form";
import { TextField } from "../../FormFields";
import Box from "@mui/material/Box";

interface AddOptionProps {
  useFormMethods: UseFormReturn<NewFlowFormFields>;
  stepFormIndex: number; // react-hook-form name
}

// input field which is it's own form, pass in method to append

// field array,
const AddOptionForm = ({ useFormMethods, stepFormIndex }: StepFormProps) => {
  const { control, setValue: setFieldValue, getValues: getFieldValues } = useFormMethods;
  return (
    <Box>
      <TextField control={control} label="Option value" variant="outlined" />
    </Box>
  );
};
