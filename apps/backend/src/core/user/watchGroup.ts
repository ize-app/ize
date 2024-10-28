import { MutationWatchGroupArgs } from "@graphql/generated/resolver-types";

import { getUserEntityIds } from "./getUserEntityIds";
import { UserPrismaType } from "./userPrismaTypes";
import { prisma } from "../../prisma/client";

// for a user to watch a group
export const watchGroup = async ({
  args,
  entityId,
  user,
}: {
  args: MutationWatchGroupArgs;
  entityId: string;
  user?: UserPrismaType;
}): Promise<boolean> => {
  await prisma.entityWatchedGroups.upsert({
    where: {
      entityId_groupId: {
        groupId: args.groupId,
        entityId,
      },
    },
    create: { groupId: args.groupId, entityId, watched: args.watch },
    update: { watched: args.watch },
  });

  // if watching group on behalf of a user, also set all their identities to watching this group
  if (user) {
    const userEntityIds = getUserEntityIds(user);
    prisma.entityWatchedGroups.updateMany({
      where: {
        groupId: args.groupId,
        entityId: { in: userEntityIds },
      },
      data: {
        watched: args.watch,
      },
    });
  }

  return args.watch;
};
