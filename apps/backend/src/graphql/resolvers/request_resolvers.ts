import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";

import { newRequestService } from "@services/requests/newRequestService";
import { formatRequest } from "../../utils/formatRequest";

import { requestInclude } from "../../utils/formatRequest";

import {
  MutationNewRequestArgs,
  QueryRequestArgs,
  Request,
} from "frontend/src/graphql/generated/graphql";

const newRequest = async (
  root: unknown,
  args: MutationNewRequestArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newRequestService(root, args, context);
};

const request = async (
  root: unknown,
  args: QueryRequestArgs,
  context: GraphqlRequestContext,
): Promise<Request> => {
  const req = await prisma.request.findFirstOrThrow({
    include: requestInclude,
    where: {
      id: args.requestId,
    },
  });

  return formatRequest(req);
};

export const requestQueries = { request };

export const requestMutations = { newRequest };
