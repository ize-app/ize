import { GroupType, Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";

import { prisma } from "../../../../prisma/client";
import { getCustomGroupsByMembers } from "../getCustomGroupsForIdentity";
import { updateIdentitiesGroups } from "../updateIdentitiesGroups";

export const updateUserCustomGroups = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  // try / catch so that me object will still return
  try {
    const identityIds = context.currentUser?.Identities.map((id) => id.id);
    if (!identityIds) return;
    await Promise.all(
      identityIds.map(async (identityId) => {
        const groupsOfIdentity = await transaction.identityGroup.findMany({
          where: {
            identityId,
          },
        });
        const customGroupIds = await getCustomGroupsByMembers({
          identityId,
          groupIds: groupsOfIdentity.map((group) => group.groupId),
        });
        await updateIdentitiesGroups({
          identityId,
          groupIds: customGroupIds,
          groupType: GroupType.GroupCustom,
          transaction,
        });
      }),
    );
  } catch (e) {
    console.log("ERROR: ", e);
  }
};
