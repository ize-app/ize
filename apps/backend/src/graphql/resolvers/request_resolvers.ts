import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";

import { newRequestService } from "@services/requests/newRequestService";
import { formatRequest } from "../../utils/formatRequest";

import { requestInclude } from "../../utils/formatRequest";

import {
  MutationNewRequestArgs,
  MutationNewResponseArgs,
  QueryRequestArgs,
  QueryRequestsForGroupArgs,
  QueryRequestsForProcessArgs,
  Request,
} from "@graphql/generated/resolver-types";
import { newResponseService } from "@/services/requests/newResponseService";
import { getGroupIdsOfUser } from "@/flow/group/getGroupIdsOfUser";

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
  return await newResponseService({ args, context });
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
  context: GraphqlRequestContext,
): Promise<Promise<Request>[]> => {
  if (!context.currentUser) return [];

  const groupIds = await getGroupIdsOfUser({ user: context.currentUser });

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
                    { groupId: { in: groupIds } },
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
