import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";

import { newRequestService } from "@services/requests/newRequestService";
import { formatRequest } from "../../utils/formatRequest";

import { groupsForCurrentUser } from "./group_resolvers";
import determineDecision from "@services/decisions/determineDecision";

import { requestInclude } from "../../utils/formatRequest";

import {
  MutationNewRequestArgs,
  MutationNewResponseArgs,
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

const newResponse = async (
  root: unknown,
  args: MutationNewResponseArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  const existingResponse = await prisma.response.findFirst({
    where: {
      requestId: args.requestId,
      creatorId: context.currentUser.id,
    },
  });
  if (existingResponse) throw Error("User already responded to this request ");

  const response = await prisma.response.create({
    data: {
      optionId: args.optionId,
      requestId: args.requestId,
      creatorId: context.currentUser.id,
    },
  });

  await determineDecision({ requestId: args.requestId });
  
  return response.id;
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

  return formatRequest(req, context.currentUser.id);
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

  return requests.map((request) =>
    formatRequest(request, context.currentUser.id),
  );
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

  return requests.map((request) =>
    formatRequest(request, context.currentUser.id),
  );
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

  return requests.map((request) =>
    formatRequest(request, context.currentUser.id),
  );
};

export const requestQueries = {
  request,
  requestsForCurrentUser,
  requestsForGroup,
  requestsForProcess,
};

export const requestMutations = { newRequest, newResponse };
