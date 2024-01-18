import { prisma } from "../../prisma/client";
import { Prisma } from "@prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { MutationNewRequestArgs } from "@graphql/generated/resolver-types";

import { roleSetInclude } from "../../utils/formatProcess";
import { getGroupIdsOfUserService } from "@services/groups/getGroupIdsOfUserService";
import { validateRequestInputs } from "./validateRequestInputs";

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
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const identityIds = context.currentUser.Identities.map((identity) => identity.id);

  const { processId, requestInputs } = args;

  const groupIds = await getGroupIdsOfUserService(context);

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

  if (!process.currentProcessVersion)
    throw Error("ERROR New Request: Can't find current process version");

  if (
    validateRequestInputs(args.requestInputs ?? [], process.currentProcessVersion?.inputTemplateSet)
  )
    throw Error("ERROR New Request: Invalid request inputs");

  const hasGroupPermission = process.currentProcessVersion?.roleSet.RoleGroups.reduce(
    (acc, curr) => {
      if (groupIds.includes(curr.groupId)) acc = true;
      return acc;
    },
    false,
  );

  const hasIdentityPermission = process.currentProcessVersion?.roleSet.RoleIdentities.reduce(
    (acc, curr) => {
      if (identityIds.includes(curr.identityId)) acc = true;
      return acc;
    },
    false,
  );

  if (!(hasGroupPermission || hasIdentityPermission))
    throw Error("Invalid permissions for creating request");

  const request = await transaction.request.create({
    data: {
      processVersionId: process.currentProcessVersionId as string,
      creatorId: context.currentUser.id,
      expirationDate: new Date(
        new Date().getTime() + (process?.currentProcessVersion?.expirationSeconds as number) * 1000,
      ),
      requestInputs: {
        create: requestInputs ?? [],
      },
    },
  });

  return request.id;
};
