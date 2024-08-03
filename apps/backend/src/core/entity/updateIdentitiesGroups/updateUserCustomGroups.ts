import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";

import { getCustomGroupsForIdentity } from "./getCustomGroupsForIdentity";
import { updateIdentitiesGroups } from "./updateIdentitiesGroups";
import { prisma } from "../../../prisma/client";

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
        const customGroupIds = await getCustomGroupsForIdentity({
          identityId,
          groupIds: groupsOfIdentity.map((group) => group.groupId),
        });
        await updateIdentitiesGroups({
          identityId,
          groupIds: customGroupIds,
          transaction,
        });
      }),
    );
  } catch (e) {
    console.log("ERROR: ", e);
  }
};
