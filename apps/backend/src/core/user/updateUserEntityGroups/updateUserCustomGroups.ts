import { GroupType, Prisma } from "@prisma/client";

import { getIzeGroupsByMembers } from "@/core/entity/updateEntitiesGroups/getIzeGroupsForEntity";
import { upsertForGroupTypeOfEntity } from "@/core/user/updateUserEntityGroups/upsertForGroupTypeOfEntity";
import { GraphqlRequestContext } from "@/graphql/context";
import { prisma } from "@/prisma/client";

export const updateUserIzeGroups = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  try {
    const entityIds = context.userEntityIds;
    if (!entityIds) return;
    await Promise.all(
      entityIds.map(async (entityId) => {
        const groupsOfEntity = await transaction.entityGroup.findMany({
          include: {
            Group: true,
          },
          where: {
            entityId,
          },
        });
        // This also needs to check whether user or their identities are part of that group
        const izeGroupIds = await getIzeGroupsByMembers({
          transaction,
          entityId,
          groupEntityIdsForEntity: groupsOfEntity.map((group) => group.Group.entityId),
        });

        await upsertForGroupTypeOfEntity({
          entityId,
          groupIds: izeGroupIds,
          groupType: GroupType.GroupIze,
          transaction,
        });
      }),
    );
  } catch (e) {
    console.log("ERROR: ", e);
  }
};
