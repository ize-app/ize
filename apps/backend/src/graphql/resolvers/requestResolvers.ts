import { getRequest as getRequestService } from "@/core/request/getRequest";
import { getRequestSteps as getRequestStepsService } from "@/core/request/getRequestSteps";
import { newEvolveRequest as newEvolveRequestService } from "@/core/request/newEvolveRequest";
import { newRequest as newRequestService } from "@/core/request/newRequest";
import { newResponse as newResponseService } from "@/core/response/newResponse";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";
import {
  MutationNewEvolveRequestArgs,
  MutationNewRequestArgs,
  MutationNewResponseArgs,
  MutationResolvers,
  QueryGetRequestArgs,
  QueryGetRequestStepsArgs,
  QueryResolvers,
  Request,
  RequestStepSummary,
} from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../context";

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
    context,
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
  return await newEvolveRequestService({ args, context });
};

const getRequest: QueryResolvers["getRequest"] = async (
  root: unknown,
  args: QueryGetRequestArgs,
  context: GraphqlRequestContext,
): Promise<Request> => {
  return await getRequestService({ args, context });
};

// getRequestSteps is called on user's dashboard to get all the request steps that the user has access to
const getRequestSteps: QueryResolvers["getRequestSteps"] = async (
  root: unknown,
  args: QueryGetRequestStepsArgs,
  context: GraphqlRequestContext,
): Promise<RequestStepSummary[]> => {
  return await getRequestStepsService({ args, user: context.currentUser });
};

const newResponse: MutationResolvers["newResponse"] = async (
  root: unknown,
  args: MutationNewResponseArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newResponseService({ args, context });
};

export const requestQueries = {
  getRequest,
  getRequestSteps,
};

export const requestMutations = { newRequest, newEvolveRequest, newResponse };
