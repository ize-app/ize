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

import { EvolveGroupFields } from "./EvolveGroupFields";
import { createActionConfigForPolicy } from "../helpers/createActionConfigForPolicy";
import { createDecisionResultConfigForPolicy } from "../helpers/createDecisionResultConfigForPolicy";
import { createResponseConfigForPolicy } from "../helpers/createResponseConfigForPolicy";

export const createEvolveGroupFlowVersionArgs = ({
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

  const requestFieldSetArgs: FieldArgs[] = [
    {
      type: FieldType.FreeInput,
      fieldId: "name",
      freeInputDataType: FieldDataType.String,
      name: EvolveGroupFields.Name,
      required: true,
    },
    {
      type: FieldType.FreeInput,
      fieldId: "description",
      freeInputDataType: FieldDataType.String,
      name: EvolveGroupFields.Description,
      required: false,
    },
    {
      type: FieldType.FreeInput,
      fieldId: "members",
      freeInputDataType: FieldDataType.EntityIds,
      name: EvolveGroupFields.Members,
      required: true,
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
      creatorEntityId: context.currentUser.Identities[0].entityId,
      groupEntityId,
      policy,
    }),
    expirationSeconds: 259200,
    result: decisionResult ? [decisionResult] : [],
    action: createActionConfigForPolicy({ actionType: ActionType.EvolveGroup, policy }),
  };
};
