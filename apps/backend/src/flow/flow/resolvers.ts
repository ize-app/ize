import { Flow, FlowType, Option, Step } from "@/graphql/generated/resolver-types";
import { FlowPrismaType, StepPrismaType } from "./types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { permissionResolver } from "../permission/resolvers";
import { fieldSetResolver } from "../fields/resolvers";
import { actionResolver } from "../action/resolvers";
import { resultConfigResolver } from "../result/resolvers";
import { hasReadPermission } from "../permission/hasReadPermission";

export const flowResolver = ({
  flow,
  evolveFlow,
  userIdentityIds,
  userGroupIds,
  userId,
}: {
  flow: FlowPrismaType;
  evolveFlow?: FlowPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
}): Flow => {
  if (!flow.CurrentFlowVersion)
    throw new GraphQLError("Flow does not have a a current version.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  return {
    __typename: "Flow",
    id: flow.id,
    type: flow.type as FlowType,
    reusable: flow.CurrentFlowVersion?.reusable,
    name: flow.CurrentFlowVersion.name,
    steps: flow.CurrentFlowVersion.Steps.map((step) =>
      stepResolver({ step, userIdentityIds, userGroupIds, userId }),
    ),
    evolve: evolveFlow
      ? flowResolver({ flow: evolveFlow, userIdentityIds, userGroupIds, userId })
      : null,
  };
};

export const stepResolver = ({
  step,
  userIdentityIds,
  userGroupIds,
  userId,
}: {
  step: StepPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
  userId: string | undefined;
}): Step => {
  let responseOptions: Option[] | undefined = undefined;

  const responseFields = step.ResponseFieldSet ? fieldSetResolver(step.ResponseFieldSet) : null;
  if (responseFields && responseFields[0].__typename === "Options") {
    responseOptions = responseFields[0].options as Option[];
  }
  return {
    request: {
      permission: permissionResolver(step.RequestPermissions, userIdentityIds),
      fields: fieldSetResolver(step.RequestFieldSet),
    },
    response: {
      permission: permissionResolver(step.ResponsePermissions, userIdentityIds),
      fields: fieldSetResolver(step.ResponseFieldSet),
    },
    action: step.ActionNew ? actionResolver(step.ActionNew, responseOptions) : null,
    result: resultConfigResolver(step.ResultConfig, responseOptions),
    expirationSeconds: step.expirationSeconds,
    userPermission: {
      request: hasReadPermission(step.RequestPermissions, userIdentityIds, userGroupIds, userId),
      response: hasReadPermission(step.ResponsePermissions, userIdentityIds, userGroupIds, userId),
    },
  };
};
