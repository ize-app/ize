import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import { useForm } from "react-hook-form";
import { useNewFlowWizardState, NewFlowFormFields } from "@/components/NewFlow/newFlowWizard";

import { WizardBody, WizardNav } from "@/components/shared/Wizard";
import { flowSchema } from "../formSchema";
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
import { TextField } from "../../FormFields";

export const defaultStep = {
  request: { permission: { type: RequestPermissionType.Anyone }, inputs: [] },
  respond: {
    permission: { type: RespondPermissionType.Anyone },
    inputs: {
      type: undefined,
      freeInput: {
        dataType: InputDataType.String,
      },
      options: {
        selectionType: OptionSelectionType.SingleSelect,
        dataType: InputDataType.String,
        creationType: OptionsCreationType.ProcessDefinedOptions,
        maxSelectableOptions: 1,
        options: [
          // {
          //   optionId: "newOption.0",
          //   name: "✅",
          //   dataType: InputDataType.String,
          // },
          // {
          //   optionId: "newOption.1",
          //   name: "❌",
          //   dataType: InputDataType.String,
          // },
        ],
      },
    },
  },
  result: {
    minimumResponses: 1,
    requestExpirationSeconds: 259200,
    decision: {
      type: ResultDecisionType.ThresholdVote,
    },
  },
  actions: { type: ActionType.None, filter: { allOptions: true } },
};

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();

  const useFormMethods = useForm<NewFlowFormFields>({
    defaultValues: {
      name: "",
      steps: [defaultStep],
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
