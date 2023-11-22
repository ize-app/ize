import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { MutationNewRequestArgs } from "frontend/src/graphql/generated/graphql";
import { roleSetInclude } from "../../utils/formatProcess";
import { groupsForCurrentUser } from "@graphql/resolvers/group_resolvers";
import { groupsForCurrentUserService } from "@services/groups/groupsForCurrentUserService";

export const newRequestService = async (
  {
    args,
    transaction = prisma,
  }: {
    args: MutationNewRequestArgs;
    transaction?: Prisma.TransactionClient;
  },
  context: GraphqlRequestContext,
) => {
  const { processId, requestInputs } = args;

  const currentGroups = await groupsForCurrentUserService(context);
  const groupIds = currentGroups.map((group) => group.id);

  const process = await transaction.process.findFirstOrThrow({
    include: {
      currentProcessVersion: {
        include: {
          inputTemplateSet: {
            include: {
              inputTemplates: true,
            },
          },
          roleSet: {
            include: roleSetInclude,
          },
        },
      },
    },
    where: {
      id: processId,
    },
  });

  const hasGroupPermission =
    process.currentProcessVersion.roleSet.roleGroups.reduce((acc, curr) => {
      if (groupIds.includes(curr.groupId)) acc = true;
      return acc;
    }, false);

  const hasUserPermission = process.currentProcessVersion.roleSet.roleUsers
    .map((user) => user.userId)
    .includes(context.currentUser.id);

  if (!(hasGroupPermission || hasUserPermission))
    throw Error("Invalid permissions for creating request");

  const request = await transaction.request.create({
    data: {
      processVersionId: process.currentProcessVersionId,
      creatorId: context.currentUser.id,
      expirationDate: new Date(
        new Date().getTime() +
          process.currentProcessVersion.expirationSeconds * 1000,
      ),
      requestInputs: {
        create: requestInputs,
      },
    },
  });

  return request.id;
};
