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
}: {
  flow: FlowPrismaType;
  evolveFlow?: FlowPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
}): Flow => {
  if (!flow.CurrentFlowVersion)
    throw new GraphQLError("Flow does not have a a current version.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });

  return {
    __typename: "Flow",
    type: flow.type as FlowType,
    reusable: flow.CurrentFlowVersion?.reusable,
    name: flow.CurrentFlowVersion.name,
    steps: flow.CurrentFlowVersion.Steps.map((step) =>
      stepResolver({ step, userIdentityIds, userGroupIds }),
    ),
    evolve: evolveFlow ? flowResolver({ flow: evolveFlow, userIdentityIds, userGroupIds }) : null,
  };
};

export const stepResolver = ({
  step,
  userIdentityIds,
  userGroupIds,
}: {
  step: StepPrismaType;
  userIdentityIds: string[];
  userGroupIds: string[];
}): Step => {
  let responseOptions: Option[] | undefined = undefined;

  const responseFields = step.ResponseFieldSet ? fieldSetResolver(step.ResponseFieldSet) : null;
  if (responseFields && responseFields[0].__typename === "Options") {
    responseOptions = responseFields[0].options as Option[];
  }
  return {
    request: {
      permission: step.RequestPermissions
        ? permissionResolver(step.RequestPermissions, userIdentityIds)
        : null,
      fields: step.RequestFieldSet ? fieldSetResolver(step.RequestFieldSet) : null,
    },
    response: {
      permission: step.ResponsePermissions
        ? permissionResolver(step.ResponsePermissions, userIdentityIds)
        : null,
      fields: responseFields,
    },
    action: step.ActionNew ? actionResolver(step.ActionNew, responseOptions) : null,
    result: resultConfigResolver(step.ResultConfig, responseOptions),
    userPermission: {
      request: hasReadPermission(step.RequestPermissions, userIdentityIds, userGroupIds),
      response: hasReadPermission(step.ResponsePermissions, userIdentityIds, userGroupIds),
    },
  };
};
