import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import { useForm } from "react-hook-form";
import { useNewFlowWizardState, NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";

import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { flowSchema } from "../formSchema";
import { TextField } from "@/components/shared/Form/FormFields/TextField";
import { StepsForm } from "../components/StepsForm";
import {
  OptionsCreationType,
  RequestPermissionType,
  RespondInputType,
  RespondPermissionType,
  InputDataType,
} from "../types";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();

  const useFormMethods = useForm<NewFlowFormFields>({
    defaultValues: {
      name: "",
      steps: [
        {
          request: { permission: { type: RequestPermissionType.Anyone, agents: [] }, inputs: [] },
          respond: {
            permission: { type: RespondPermissionType.Anyone, agents: [] },
            inputs: {
              type: null,
              options: {
                dataType: InputDataType.String,
                creationType: OptionsCreationType.ProcessDefinedOptions,
                options: [{ name: "✅" }, { name: "❌" }],
              },
            },
          },
        },
      ],
    },
    resolver: zodResolver(flowSchema),
    shouldUnregister: true,
  });

  const onSubmit = (data: NewFlowFormFields) => {
    console.log("data is ", data);
    onNext();
  };

  return (
    <>
      <WizardBody>
        <Box component="form" sx={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <TextField<NewFlowFormFields>
            name={"name"}
            control={useFormMethods.control}
            placeholderText=""
            label="Flow name"
            variant="standard"
          />
          <StepsForm useFormMethods={useFormMethods} />
        </Box>
      </WizardBody>
      <WizardNav
        onNext={useFormMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </>
  );
};
