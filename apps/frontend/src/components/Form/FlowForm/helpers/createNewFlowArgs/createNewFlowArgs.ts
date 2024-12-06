import { NewFlowArgs, NewStepArgs } from "@/graphql/generated/graphql";

import { createActionArgs } from "./createActionArgs";
import { createFieldsArgs } from "./createFieldsArgs";
import { createPermissionArgs } from "./createPermissionsArgs";
import { createResultsArgs } from "./createResultArgs";
import { FlowSchemaType } from "../../formValidation/flow";

export const createNewFlowArgs = (formState: FlowSchemaType, _userId: string): NewFlowArgs => {
  const args: NewFlowArgs = {
    flowVersionId: formState.flowVersionId,
    name: formState.name,
    type: formState.type,
    fieldSet: {
      fields: createFieldsArgs(formState.fieldSet.fields ?? []),
      locked: formState.fieldSet.locked,
    },
    trigger: {
      permission: createPermissionArgs(formState.trigger.permission),
    },
    steps: formState.steps.map((step): NewStepArgs => {
      return {
        ...step,
        fieldSet: {
          fields: createFieldsArgs(step.fieldSet.fields ?? []),
          locked: step.fieldSet.locked,
        },
        response: step.response && {
          expirationSeconds: step.response.expirationSeconds,
          allowMultipleResponses: step.response.allowMultipleResponses,
          canBeManuallyEnded: step.response.canBeManuallyEnded,
          permission: createPermissionArgs(step.response.permission),
          minResponses: step.response.minResponses,
        },
        result: createResultsArgs(step.result, step.fieldSet.fields),
        action: step.action ? createActionArgs(step.action) : null,
      };
    }),
  };

  // console.log("new flow args", args);

  return args;
};
