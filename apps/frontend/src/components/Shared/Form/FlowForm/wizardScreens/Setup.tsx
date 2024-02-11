import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { useNewFlowWizardState, NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";

import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { flowSchema } from "../formValidation/flow";
import { StepsForm } from "../components/StepsForm";
import {
  OptionsCreationType,
  RespondPermissionType,
  InputDataType,
  OptionSelectionType,
  ResultDecisionType,
  ActionType,
  RequestPermissionType,
} from "../types";
import { Switch, TextField } from "../../FormFields";
import { FieldType } from "@/graphql/generated/graphql";

export const defaultStep = {
  request: { permission: { type: RequestPermissionType.Anyone }, fields: [] },
  response: {
    permission: { type: RespondPermissionType.Anyone },
    field: {
      fieldId: "",
      type: FieldType.Options,
      name: "temp",
    },
  },
  result: {
    minimumResponses: 1,
    requestExpirationSeconds: 259200,
    decision: {
      // type: ResultDecisionType.ThresholdVote,
      // threshold: 1,
      // defaultOption: {
      //   hasDefault: false,
      // },
    },
  },

  actions: { type: ActionType.None, filter: { allOptions: true } },
};

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();

  const useFormMethods = useForm<NewFlowFormFields>({
    defaultValues: {
      name: formState.name ?? "",
      reusable: formState.reusable ?? false,
      steps: formState.steps ? [...formState.steps] : [defaultStep],
    },
    resolver: zodResolver(flowSchema),
    shouldUnregister: true,
  });
  const onSubmit = (data: NewFlowFormFields) => {
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
            maxWidth: "1000px",
            width: "100%",
          }}
        >
          <TextField<NewFlowFormFields>
            name={"name"}
            control={useFormMethods.control}
            placeholderText="What's the purpose of this flow? (e.g. 'Create event on shared calendar')"
            label="Flow name"
            variant="standard"
          />
          <Switch<NewFlowFormFields>
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
