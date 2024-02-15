import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { useNewFlowWizardState } from "@/components/NewFlow/newFlowWizard";
import { FlowSchemaType, StepSchemaType } from "../formValidation/flow";

import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { flowSchema } from "../formValidation/flow";
import { StepsForm } from "../components/StepsForm";
import { PermissionType } from "../formValidation/permission";
import { Switch, TextField } from "../../FormFields";
import {
  ActionNewType,
  DecisionType,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  ResultType,
} from "@/graphql/generated/graphql";

export const defaultStep: StepSchemaType = {
  request: {
    permission: { type: PermissionType.Anyone },
    fields: [],
  },
  response: {
    permission: { type: PermissionType.Anyone },
    field: {
      fieldId: "",
      type: FieldType.FreeInput,
      name: "",
      freeInputDataType: FieldDataType.String,
      required: true,
    },
  },
  result: {
    type: ResultType.Decision,
    minimumResponses: 1,
    requestExpirationSeconds: 259200,
    decision: {
      type: DecisionType.NumberThreshold,
      threshold: {
        decisionThresholdCount: 2,
      },
      defaultOption: {
        hasDefault: false,
      },
    },
  },
  action: { type: ActionNewType.None },
};

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();

  const useFormMethods = useForm<FlowSchemaType>({
    defaultValues: {
      name: formState.name ?? "",
      reusable: formState.reusable ?? false,
      steps: formState.steps ? [...formState.steps] : [defaultStep],
    },
    resolver: zodResolver(flowSchema),
    shouldUnregister: true,
  });
  const onSubmit = (data: FlowSchemaType) => {
    console.log("data is ", data);
    setFormState({ ...data });
    onNext();
  };

  return (
    <form>
      <WizardBody>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            maxWidth: "1200px",
            width: "100%",
          }}
        >
          <Switch<FlowSchemaType>
            name={`reusable`}
            control={useFormMethods.control}
            label="Reusable flow"
          />
          <StepsForm useFormMethods={useFormMethods} />
        </Box>
      </WizardBody>
      <WizardNav
        onNext={useFormMethods.handleSubmit(onSubmit)}
        onPrev={onPrev}
        nextLabel={nextLabel}
      />
    </form>
  );
};
