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
import { logResolverError } from "../logResolverError";

const newRequest: MutationResolvers["newRequest"] = async (
  root: unknown,
  args: MutationNewRequestArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  try {
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
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "newRequest", operation: "mutation" },
        contexts: { args },
      },
    });
  }
};

const newEvolveRequest: MutationResolvers["newEvolveRequest"] = async (
  root: unknown,
  args: MutationNewEvolveRequestArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  try {
    if (!context.currentUser)
      throw new GraphQLError("Unauthenticated", {
        extensions: { code: CustomErrorCodes.Unauthenticated },
      });
    const requestId = await newEvolveRequestService({
      args,
      entityContext: { type: "user", context },
    });
    // update user groups created while updating flow
    return requestId;
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "newEvolveRequest", operation: "mutation" },
        contexts: { args },
      },
    });
  }
};

const getRequest: QueryResolvers["getRequest"] = async (
  root: unknown,
  args: QueryGetRequestArgs,
  context: GraphqlRequestContext,
): Promise<Request> => {
  try {
    return await getRequestService({ args, context });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "getRequest", operation: "query" },
        contexts: { args },
      },
    });
  }
};

// getRequestSteps is called on user's dashboard to get all the request steps that the user has access to
const getRequests: QueryResolvers["getRequests"] = async (
  root: unknown,
  args: QueryGetRequestsArgs,
  context: GraphqlRequestContext,
): Promise<RequestSummary[]> => {
  try {
    return await getRequestSummariesService({ args, context });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "getRequests", operation: "query" },
        contexts: { args },
      },
    });
  }
};

const newResponse: MutationResolvers["newResponse"] = async (
  root: unknown,
  args: MutationNewResponseArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  try {
    return await newResponseService({ entityContext: { type: "user", context }, args });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "newResponse", operation: "mutation" },
        contexts: { args },
      },
    });
  }
};

const endRequestStep: MutationResolvers["endRequestStep"] = async (
  root: unknown,
  args: MutationEndRequestStepArgs,
  context: GraphqlRequestContext,
): Promise<boolean> => {
  try {
    return await endRequestStepService({ args, context });
  } catch (error) {
    return logResolverError({
      error,
      sentryOptions: {
        tags: { resolver: "endRequestStep", operation: "mutation" },
        contexts: { args },
      },
    });
  }
};

export const requestQueries = {
  getRequest,
  getRequests,
};

export const requestMutations = { newRequest, newEvolveRequest, newResponse, endRequestStep };
