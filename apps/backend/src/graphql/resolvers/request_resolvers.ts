import { GraphqlRequestContext } from "../../graphql/context";

import { newRequest as newRequestService } from "@/flow/request/newRequest";
import { newResponse as newResponseService } from "@/flow/response/newResponse";
import { CustomErrorCodes, GraphQLError } from "@graphql/errors";
import { getRequest as getRequestService } from "@/flow/request/getRequest";

import {
  MutationNewRequestArgs,
  MutationNewResponseArgs,
  MutationResolvers,
  QueryGetRequestArgs,
  QueryResolvers,
  RequestNew,
} from "@graphql/generated/resolver-types";

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

const getRequest: QueryResolvers["getRequest"] = async (
  root: unknown,
  args: QueryGetRequestArgs,
  context: GraphqlRequestContext,
): Promise<RequestNew> => {
  return await getRequestService({ args, context });
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
};

export const requestMutations = { newRequest, newResponse };
