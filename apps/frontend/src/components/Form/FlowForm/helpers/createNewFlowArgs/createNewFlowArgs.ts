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
    fieldSet: {
      fields: createFieldsArgs(formState.fieldSet.fields ?? [], []),
      locked: formState.fieldSet.locked,
    },
    trigger: {
      permission: createPermissionArgs(formState.trigger.permission),
    },
    steps: formState.steps.map((step, index): NewStepArgs => {
      return {
        ...step,
        fieldSet: {
          fields: createFieldsArgs(step.fieldSet.fields ?? [], resultConfigCache),
          locked: step.fieldSet.locked,
        },
        response: step.response && {
          ...step.response,
          permission: createPermissionArgs(step.response.permission),
        },
        result: createResultsArgs(step.result, step.fieldSet.fields, index, resultConfigCache),
        action: step.action ? createActionArgs(step.action, step.fieldSet.fields) : null,
      };
    }),
    evolve: formState.evolve && {
      ...formState.evolve,
      decision: {
        type: formState.evolve.decision.type,
        //@ts-expect-error Zod discriminated union limitation
        // eslint-disable-next-line
        threshold: formState.evolve.decision.threshold as number,
      } as DecisionArgs,
      requestPermission: createPermissionArgs(formState.evolve.requestPermission),
      responsePermission: createPermissionArgs(formState.evolve.responsePermission),
    },
  };
  return args;
};
