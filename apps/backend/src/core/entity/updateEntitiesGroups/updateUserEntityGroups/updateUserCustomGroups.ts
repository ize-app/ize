import { GroupType, Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";

import { prisma } from "../../../../prisma/client";
import { getIzeGroupsByMembers } from "../getIzeGroupsForEntity";
import { upsertForGroupTypeOfEntity } from "../upsertForGroupTypeOfEntity";

export const updateUserIzeGroups = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  // try / catch so that me object will still return
  try {
    const entityIds = context.userEntityIds;
    if (!entityIds) return;
    await Promise.all(
      entityIds.map(async (entityId) => {
        // get all
        const groupsOfEntity = await transaction.entityGroup.findMany({
          include: {
            Group: true,
          },
          where: {
            entityId,
          },
        });
        const izeGroupIds = await getIzeGroupsByMembers({
          entityId,
          groupEntityIdsForEntity: groupsOfEntity.map((group) => group.groupId),
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
