import { FlowSchemaType } from "../../formValidation/flow";
import { DecisionArgs, NewFlowArgs } from "@/graphql/generated/graphql";
import { createFieldsArgs } from "./createFieldsArgs";
import { createPermissionArgs } from "./createPermissionsArgs";
import { createActionArgs } from "./createActionArgs";
import { createResultsArgs } from "./createResultArgs";

export interface ResultConfigCache {
  id: string;
  stepIndex: number;
  resultIndex: number;
}

export const createNewFlowArgs = (formState: FlowSchemaType, userId: string): NewFlowArgs => {
  const resultConfigCache: ResultConfigCache[] = [];
  const args: NewFlowArgs = {
    name: formState.name,
    reusable: true,
    steps: formState.steps.map((step, index) => {
      return {
        ...step,
        request: step.request && {
          fields: createFieldsArgs(step.request.fields ?? [], resultConfigCache),
          permission: createPermissionArgs(
            step.request?.permission,
            index === 0 ? userId : undefined,
        ),
        },
        response: step.response && {
          fields: createFieldsArgs(step.response.fields ?? [], resultConfigCache),
          permission: createPermissionArgs(step.response.permission),
        },
        result: createResultsArgs(
          step.result,
          step.response?.fields ?? [],
          index,
          resultConfigCache,
        ),
        action: step.action ? createActionArgs(step.action, step.response?.fields) : null,
        expirationSeconds: step.expirationSeconds ?? null,
      };
    }),
    evolve: formState.evolve && {
      ...formState.evolve,
      decision: formState.evolve.decision as DecisionArgs,
      requestPermission: createPermissionArgs(formState.evolve.requestPermission),
      responsePermission: createPermissionArgs(formState.evolve.responsePermission),
    },
  };
  console.log("created args are ", args);
  return args;
};
