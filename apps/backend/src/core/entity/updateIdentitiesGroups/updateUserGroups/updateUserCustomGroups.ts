import { GroupType, Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";

import { prisma } from "../../../../prisma/client";
import { getIzeGroupsByMembers } from "../getCustomGroupsForIdentity";
import { updateEntitiesGroups } from "../updateEntitiesGroups";

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
        const groupsOfIdentity = await transaction.entityGroup.findMany({
          where: {
            entityId,
          },
        });
        const izeGroupIds = await getIzeGroupsByMembers({
          identityId: entityId,
          groupIds: groupsOfIdentity.map((group) => group.groupId),
        });
        await updateEntitiesGroups({
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
