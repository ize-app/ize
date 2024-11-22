import { GraphQLError } from "graphql";

import { systemFieldDefaults } from "@/core/fields/systemFieldDefaults";
import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import {
  ActionType,
  FieldArgs,
  FlowType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
  NewFlowArgs,
  NewStepArgs,
  SystemFieldType,
} from "@/graphql/generated/resolver-types";

import { createActionArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createActionArgsForPolicy";
import { createApprovalFieldSetArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createApprovalFieldSetArgsForPolicy";
import { createDecisionResultArgsForPolicy } from "../../generateFlowArgs/flowArgsForPolicy/createDecisionResultArgsForPolicy";

const requestFieldSetArgs: FieldArgs[] = [
  systemFieldDefaults[SystemFieldType.WatchFlow],
  systemFieldDefaults[SystemFieldType.UnwatchFlow],
];

export const createGroupWatchFlowFlowArgs = ({
  groupEntityId,
  context,
  policy,
}: {
  context: GraphqlRequestContext;
  groupEntityId: string;
  policy: GroupFlowPolicyArgs;
}): NewFlowArgs => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  return {
    flowVersionId: crypto.randomUUID(),
    type: FlowType.GroupWatchFlow,
    name: "Watch/unwatch flow",
    fieldSet: {
      locked: true,
      fields: requestFieldSetArgs,
    },
    trigger: {
      permission: { anyone: false, entities: [{ id: groupEntityId }] },
    },
    steps: [createGroupWatchStepArgs({ groupEntityId, context, policy })],
  };
};

export const createGroupWatchStepArgs = ({
  groupEntityId,
  context,
  policy,
}: {
  context: GraphqlRequestContext;
  groupEntityId: string;
  policy: GroupFlowPolicyArgs;
}): NewStepArgs => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  const creatorEntityId = context.currentUser.entityId;

  const decisionResult = createDecisionResultArgsForPolicy({ policy });
  const responseApprovalFieldArgs: FieldArgs | undefined = createApprovalFieldSetArgsForPolicy({
    policy,
  });

  const noResponse = policy.type === GroupFlowPolicyType.GroupAutoApprove;

  return {
    fieldSet: {
      fields: responseApprovalFieldArgs ? [responseApprovalFieldArgs] : [],
      locked: false,
    },
    response: !noResponse
      ? {
          canBeManuallyEnded: false,
          expirationSeconds: 259200,
          allowMultipleResponses: false,
          minResponses: 1,
          permission: {
            anyone: false,
            entities: [
              {
                id:
                  policy.type === GroupFlowPolicyType.CreatorAutoApprove
                    ? creatorEntityId
                    : groupEntityId,
              },
            ],
          },
        }
      : undefined,
    result: decisionResult ? [decisionResult] : [],
    action: createActionArgsForPolicy({ actionType: ActionType.GroupWatchFlow, policy }),
  };
};
