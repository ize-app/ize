import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";

import { newRequestService } from "@services/requests/newRequestService";

import { MutationNewRequestArgs } from "frontend/src/graphql/generated/graphql";

const newRequest = async (
  root: unknown,
  args: MutationNewRequestArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  return await newRequestService(root, args, context);
};

export const requestQueries = {};

export const requestMutations = { newRequest };
