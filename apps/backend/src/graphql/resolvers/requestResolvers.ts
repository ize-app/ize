import { getRequest as getRequestService } from "@/core/request/getRequest";
import { getRequestSummaries as getRequestSummariesService } from "@/core/request/getRequestSummaries";
import { newEvolveRequest as newEvolveRequestService } from "@/core/request/newEvolveRequest";
import { newRequest as newRequestService } from "@/core/request/newRequest";
import { newResponse as newResponseService } from "@/core/response/newResponse";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";
import {
  MutationEndRequestStepArgs,
  MutationNewEvolveRequestArgs,
  MutationNewRequestArgs,
  MutationNewResponseArgs,
  MutationResolvers,
  QueryGetRequestArgs,
  QueryGetRequestsArgs,
  QueryResolvers,
  Request,
  RequestSummary,
} from "@graphql/generated/resolver-types";

import { endRequestStep as endRequestStepService } from "@/core/request/updateState/endRequestStep";

import { GraphqlRequestContext } from "../context";
import { updateUserGroups } from "@/core/entity/updateIdentitiesGroups/updateUserGroups/updateUserGroups";

const newRequest: MutationResolvers["newRequest"] = async (
  root: unknown,
  args: MutationNewRequestArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  return await newRequestService({
    args,
    entityContext: {
      type: "user",
      context,
    },
  });
};

const newEvolveRequest: MutationResolvers["newEvolveRequest"] = async (
  root: unknown,
  args: MutationNewEvolveRequestArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });
  const requestId = await newEvolveRequestService({
    args,
    entityContext: { type: "user", context },
  });
  // update user groups created while updating flow
  await updateUserGroups({ context });
  return requestId;
};

const getRequest: QueryResolvers["getRequest"] = async (
  root: unknown,
  args: QueryGetRequestArgs,
  context: GraphqlRequestContext,
): Promise<Request> => {
  return await getRequestService({ args, context });
};

// getRequestSteps is called on user's dashboard to get all the request steps that the user has access to
const getRequests: QueryResolvers["getRequests"] = async (
  root: unknown,
  args: QueryGetRequestsArgs,
  context: GraphqlRequestContext,
): Promise<RequestSummary[]> => {
  return await getRequestSummariesService({ args, user: context.currentUser });
};

const newResponse: MutationResolvers["newResponse"] = async (
  root: unknown,
  args: MutationNewResponseArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newResponseService({ entityContext: { type: "user", context }, args });
};

const endRequestStep: MutationResolvers["endRequestStep"] = async (
  root: unknown,
  args: MutationEndRequestStepArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  return await endRequestStepService({ args, context });
};

export const requestQueries = {
  getRequest,
  getRequests,
};

export const requestMutations = { newRequest, newEvolveRequest, newResponse, endRequestStep };
