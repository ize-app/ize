import { FlowFragment, PermissionFragment, ResultType } from "@/graphql/generated/graphql";

import { createPermissionFormState } from "./createPermissionFormState";
import { EvolveSchemaType } from "../../formValidation/evolve";

export const createEvolveFormState = (flow: FlowFragment): EvolveSchemaType => {
  if (
    !flow.steps[0] ||
    !(flow.steps[0].result[0].__typename === ResultType.Decision) ||
    !flow.steps[0].result[0].threshold
  )
    throw Error("Invalid evolve flow state");
  return {
    requestPermission: createPermissionFormState(
      flow.steps[0].request.permission as PermissionFragment,
    ),
    responsePermission: createPermissionFormState(
      flow.steps[0].response.permission as PermissionFragment,
    ),
    decision: {
      type: flow.steps[0].result[0].decisionType,
      threshold: flow.steps[0].result[0].threshold,
      // defaultOptionId:
      //   flow.steps[0].result[0].defaultOption?.optionId ?? DefaultOptionSelection.None,
    },
  };
};
