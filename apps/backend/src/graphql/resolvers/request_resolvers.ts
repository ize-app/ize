import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";

import { newRequestService } from "@services/requests/newRequestService";
import { formatRequest } from "../../utils/formatRequest";

import { groupsForCurrentUser } from "./group_resolvers";

import { requestInclude } from "../../utils/formatRequest";

import {
  MutationNewRequestArgs,
  QueryRequestArgs,
  QueryRequestsForGroupArgs,
  QueryRequestsForProcessArgs,
  QueryRequestsForCurrentUserArgs,
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

const requestsForCurrentUser = async (
  root: unknown,
  args: QueryRequestsForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<Request[]> => {
  const requests = await prisma.request.findMany({
    include: requestInclude,
    where: {
      processVersion: {
        roleSet: {
          OR: [
            {
              roleGroups: {
                some: {
                  AND: [
                    { groupId: { in: args.groups } },
                    {
                      type: "Request",
                    },
                  ],
                },
              },
            },
            {
              roleUsers: {
                some: {
                  AND: [
                    { userId: context.currentUser.id },
                    {
                      type: "Request",
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
  });

  return requests.map((request) => formatRequest(request));
};

const requestsForGroup = async (
  root: unknown,
  args: QueryRequestsForGroupArgs,
  context: GraphqlRequestContext,
): Promise<Request[]> => {
  console.log("group id  is ", args.groupId);
  const requests = await prisma.request.findMany({
    include: requestInclude,
    where: {
      processVersion: {
        roleSet: {
          roleGroups: {
            some: {
              groupId: args.groupId,
            },
          },
        },
      },
    },
  });

  return requests.map((request) => formatRequest(request));
};

const requestsForProcess = async (
  root: unknown,
  args: QueryRequestsForProcessArgs,
  context: GraphqlRequestContext,
): Promise<Request[]> => {
  const requests = await prisma.request.findMany({
    include: requestInclude,
    where: {
      processVersion: {
        processId: args.processId,
      },
    },
  });

  return requests.map((request) => formatRequest(request));
};

export const requestQueries = {
  request,
  requestsForCurrentUser,
  requestsForGroup,
  requestsForProcess,
};

export const requestMutations = { newRequest };
