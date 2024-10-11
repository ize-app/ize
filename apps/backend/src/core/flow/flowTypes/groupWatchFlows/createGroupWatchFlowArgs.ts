import { GraphQLError } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import {
  ActionType,
  FieldArgs,
  FieldDataType,
  FieldType,
  GroupFlowPolicyArgs,
  NewStepArgs,
} from "@/graphql/generated/resolver-types";

import { GroupWatchFlowFields } from "./GroupWatchFlowFields";
import { createActionConfigForPolicy } from "../../helpers/createActionConfigForPolicy";
import { createDecisionResultConfigForPolicy } from "../../helpers/createDecisionResultConfigForPolicy";
import { createResponseConfigForPolicy } from "../../helpers/createResponseConfigForPolicy";

export const createGroupWatchFlowArgs = ({
  groupEntityId,
  policy,
  context,
}: {
  context: GraphqlRequestContext;
  policy: GroupFlowPolicyArgs;
  groupEntityId: string;
}): NewStepArgs => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const requestFieldSetArgs: FieldArgs[] = [
    {
      type: FieldType.FreeInput,
      fieldId: "watchFlow",
      freeInputDataType: FieldDataType.FlowIds,
      name: GroupWatchFlowFields.WatchFlow,
      required: false,
    },
    {
      type: FieldType.FreeInput,
      fieldId: "unwatchFlow",
      freeInputDataType: FieldDataType.FlowIds,
      name: GroupWatchFlowFields.UnwatchFlow,
      required: false,
    },
  ];

  const decisionResult = createDecisionResultConfigForPolicy({ policy });

  return {
    allowMultipleResponses: false,
    request: {
      permission: { anyone: false, entities: [{ id: groupEntityId }] },
      fields: requestFieldSetArgs,
      fieldsLocked: true,
    },
    response: createResponseConfigForPolicy({
      creatorEntityId: context.currentUser.entityId,
      groupEntityId,
      policy,
    }),
    expirationSeconds: 259200,
    canBeManuallyEnded: false,
    result: decisionResult ? [decisionResult] : [],
    action: createActionConfigForPolicy({ actionType: ActionType.GroupWatchFlow, policy }),
  };
};
