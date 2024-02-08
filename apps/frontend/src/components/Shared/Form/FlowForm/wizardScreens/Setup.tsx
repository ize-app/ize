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
import { Switch, TextField } from "../../FormFields";

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
        previousStepOptions: true,
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
