import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";

import { newRequestService } from "@services/requests/newRequestService";
import { formatRequest } from "../../utils/formatRequest";

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
} from "@graphql/generated/resolver-types";
import { resultInclude } from "../../utils/formatResult";

const newRequest = async (
  root: unknown,
  args: MutationNewRequestArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  return await newRequestService({ args }, context);
};

const newResponse = async (
  root: unknown,
  args: MutationNewResponseArgs,
  context: GraphqlRequestContext,
): Promise<string> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const existingResponse = await prisma.response.findFirst({
    where: {
      requestId: args.requestId,
      creatorId: context.currentUser.id,
    },
  });

  if (existingResponse) throw Error("ERROR User already responded to this request ");

  const request = await prisma.request.findFirstOrThrow({
    include: {
      result: { include: resultInclude },
    },
    where: {
      id: args.requestId,
    },
  });

  if (request.expirationDate < new Date() || request.result)
    throw Error("ERROR New Response: Request is no longer accepting responses");

  const response = await prisma.response.create({
    data: {
      optionId: args.optionId,
      requestId: args.requestId,
      creatorId: context.currentUser.id,
    },
  });

  await determineDecision({ requestId: args.requestId, user: context.currentUser });

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

  return await formatRequest(req, context.currentUser);
};

const requestsForCurrentUser = async (
  root: unknown,
  args: QueryRequestsForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<Promise<Request>[]> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const identityIds = context.currentUser.Identities.map((identity) => identity.id);

  const requests = await prisma.request.findMany({
    include: requestInclude,
    where: {
      processVersion: {
        roleSet: {
          OR: [
            {
              RoleGroups: {
                some: {
                  AND: [
                    { groupId: { in: args.groupIds } },
                    {
                      type: "Request",
                    },
                  ],
                },
              },
            },
            {
              RoleIdentities: {
                some: {
                  AND: [
                    { identityId: { in: identityIds } },
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

  return requests.map((request) => formatRequest(request, context.currentUser));
};

const requestsForGroup = async (
  root: unknown,
  args: QueryRequestsForGroupArgs,
  context: GraphqlRequestContext,
): Promise<Request[]> => {
  const requests = await prisma.request.findMany({
    include: requestInclude,
    where: {
      processVersion: {
        roleSet: {
          RoleGroups: {
            some: {
              groupId: args.groupId,
            },
          },
        },
      },
    },
  });

  return Promise.all(requests.map((request) => formatRequest(request, context.currentUser)));
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

  return Promise.all(requests.map((request) => formatRequest(request, context.currentUser)));
};

export const requestQueries = {
  request,
  requestsForCurrentUser,
  requestsForGroup,
  requestsForProcess,
};

export const requestMutations = { newRequest, newResponse };
