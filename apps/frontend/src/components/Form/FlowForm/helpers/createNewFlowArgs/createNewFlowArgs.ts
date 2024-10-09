import { DecisionArgs, NewFlowArgs, NewStepArgs } from "@/graphql/generated/graphql";

import { createActionArgs } from "./createActionArgs";
import { createFieldsArgs } from "./createFieldsArgs";
import { createPermissionArgs } from "./createPermissionsArgs";
import { createResultsArgs } from "./createResultArgs";
import { FlowSchemaType } from "../../formValidation/flow";

export interface ResultConfigCache {
  id: string;
  stepIndex: number;
  resultIndex: number;
}

export const createNewFlowArgs = (formState: FlowSchemaType, _userId: string): NewFlowArgs => {
  const resultConfigCache: ResultConfigCache[] = [];
  const args: NewFlowArgs = {
    name: formState.name,
    reusable: formState.reusable,
    steps: formState.steps.map((step, index): NewStepArgs => {
      return {
        ...step,
        request: step.request && {
          fields: createFieldsArgs(step.request.fields ?? [], resultConfigCache),
          permission: createPermissionArgs(step.request?.permission),
          fieldsLocked: step.request.fieldsLocked ?? false,
        },
        response: step.response && {
          fields: createFieldsArgs(step.response.fields ?? [], resultConfigCache),
          permission: createPermissionArgs(step.response.permission),
          fieldsLocked: step.response.fieldsLocked ?? false,
        },
        result: createResultsArgs(
          step.result,
          step.response?.fields ?? [],
          index,
          resultConfigCache,
        ),
        action: step.action ? createActionArgs(step.action, step.response?.fields) : null,
        expirationSeconds: step.expirationSeconds ?? null,
        allowMultipleResponses: step.allowMultipleResponses,
        canBeManuallyEnded: step.canBeManuallyEnded,
      };
    }),
    evolve: formState.evolve && {
      ...formState.evolve,
      decision: {
        ...formState.evolve.decision,
      } as DecisionArgs,
      requestPermission: createPermissionArgs(formState.evolve.requestPermission),
      responsePermission: createPermissionArgs(formState.evolve.responsePermission),
    },
  };
  return args;
};
