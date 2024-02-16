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
  AgentType,
  DecisionType,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  ResultType,
} from "@/graphql/generated/graphql";
import { useContext, useEffect, useMemo, useState } from "react";
import { CurrentUserContext } from "@/contexts/current_user_context";
import {
  defaultDecisionStepFormValues,
  getDefaultFormValues,
} from "../helpers/getDefaultFormValues";

export const Setup = () => {
  const { formState, setFormState, onNext, onPrev, nextLabel } = useNewFlowWizardState();

  const { me } = useContext(CurrentUserContext);

  const useFormMethods = useForm<FlowSchemaType>({
    defaultValues: {
      name: formState.name ?? "",
      reusable: formState.reusable ?? false,
      evolve: {
        requestPermission: { type: PermissionType.Anyone, entities: [] },
        responsePermission: {
          type: PermissionType.Entities,
          entities: me?.identities
            ? [me.identities.map((id) => ({ ...id, __typename: "Identity" as AgentType }))[0]]
            : [],
        },
        decision: {
          type: DecisionType.NumberThreshold,
          threshold: {
            decisionThresholdCount: 1,
          },
        },
      },
      steps: formState.steps ? [...formState.steps] : [defaultDecisionStepFormValues],
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
          <TextField<FlowSchemaType>
            control={useFormMethods.control}
            width="300px"
            label="What's the purpose of this form?"
            placeholderText="What's the purpose of this form?"
            variant="standard"
            size="small"
            showLabel={false}
            name={`name`}
          />
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
