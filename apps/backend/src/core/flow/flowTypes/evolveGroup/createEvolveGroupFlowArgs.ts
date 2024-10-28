import { SystemFieldType } from "@prisma/client";
import { GraphQLError } from "graphql";

import { systemFieldDefaults } from "@/core/fields/systemFieldDefaults";
import { GraphqlRequestContext } from "@/graphql/context";
import { CustomErrorCodes } from "@/graphql/errors";
import {
  ActionType,
  FieldArgs,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  FlowType,
  GroupFlowPolicyArgs,
  GroupFlowPolicyType,
  NewFlowArgs,
  NewStepArgs,
} from "@/graphql/generated/resolver-types";

import { createActionConfigForPolicy } from "../../helpers/createActionConfigForPolicy";
import { createDecisionResultConfigForPolicy } from "../../helpers/createDecisionResultConfigForPolicy";

const requestFieldSetArgs: FieldArgs[] = [
  systemFieldDefaults[SystemFieldType.GroupName],
  systemFieldDefaults[SystemFieldType.GroupDescription],
  systemFieldDefaults[SystemFieldType.GroupMembers],
];

const responseApprovalFieldArgs: FieldArgs = {
  type: FieldType.Options,
  fieldId: "new",
  isInternal: false,
  name: "Do you approve of these changes?",
  required: true,
  optionsConfig: {
    previousStepOptions: false,
    maxSelections: 1,
    selectionType: FieldOptionsSelectionType.Select,
    linkedResultOptions: [],
    options: [
      { optionId: "approve", dataType: FieldDataType.String, name: "✅" },
      { optionId: "deny", dataType: FieldDataType.String, name: "❌" },
    ],
  },
};

export const createEvolveGroupFlowArgs = ({
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
    type: FlowType.EvolveGroup,
    name: "Evolve group",
    fieldSet: {
      locked: true,
      fields: requestFieldSetArgs,
    },
    trigger: {
      permission: { anyone: false, entities: [{ id: groupEntityId }] },
    },
    steps: [createEvolveGroupStepArgs({ groupEntityId, context, policy })],
  };
};

export const createEvolveGroupStepArgs = ({
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

  const decisionResult = createDecisionResultConfigForPolicy({ policy });

  const noResponse = policy.type === GroupFlowPolicyType.GroupAutoApprove;

  return {
    fieldSet: {
      fields: [responseApprovalFieldArgs],
      locked: true,
    },
    response: !noResponse
      ? {
          canBeManuallyEnded: false,
          expirationSeconds: 259200,
          allowMultipleResponses: false,
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
    action: createActionConfigForPolicy({ actionType: ActionType.EvolveGroup, policy }),
  };
};
