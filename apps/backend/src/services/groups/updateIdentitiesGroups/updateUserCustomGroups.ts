import { Prisma } from "@prisma/client";

import { prisma } from "../../../prisma/client";
import { GraphqlRequestContext } from "@/graphql/context";
import { updateIdentitiesGroups } from "./updateIdentitiesGroups";

export const updateUserCustomGroups = async ({
  context,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}) => {
  try {
    if (!context.currentUser) throw Error("ERROR Unauthenticated user");

    await Promise.all(
      context.currentUser.Identities.map(async (id): Promise<void> => {
        await updateIdentityCustomGroups({ identityId: id.id, transaction });
      }),
    );
  } catch (e) {
    console.log("ERROR: updateUserCustomGroups ", e);
  }
};

const updateIdentityCustomGroups = async ({
  identityId,
  transaction = prisma,
}: {
  identityId: string;
  transaction?: Prisma.TransactionClient;
}) => {
  const identityCustomGroups = await transaction.groupCustom.findMany({
    where: {
      OR: [
        {
          CustomGroupMemberGroups: {
            some: {
              Group: {
                IdentitiesGroups: {
                  some: {
                    identityId: identityId,
                  },
                },
              },
            },
          },
        },
        {
          CustomGroupMemberIdentities: {
            some: {
              identityId: identityId,
            },
          },
        },
      ],
    },
  });

  const groupIds = identityCustomGroups.map((group) => group.groupId);
  await updateIdentitiesGroups({ identityId, groupIds, transaction });
};
