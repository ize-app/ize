import { Prisma } from "@prisma/client";

import { GraphqlRequestContext } from "@/graphql/context";
import { EntityType, MutationNewCustomGroupArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

export const newCustomGroup = async ({
  context,
  args,
  transaction = prisma,
}: {
  context: GraphqlRequestContext;
  args: MutationNewCustomGroupArgs;
  transaction?: Prisma.TransactionClient;
}): Promise<string> => {
  if (!context.currentUser) throw Error("ERROR Unauthenticated user");

  const customGroupEntity = await transaction.entity.create({
    select: {
      Group: true,
    },
    data: {
      Group: {
        create: {
          creatorId: context.currentUser?.id,
          GroupCustom: {
            create: {
              name: args.inputs.name,
              description: args.inputs.description,
              CustomGroupMemberGroups: {
                createMany: {
                  data: args.inputs.members
                    .filter((members) => members.entityType === EntityType.Group)
                    .map((memberGroup) => ({ groupId: memberGroup.id })),
                },
              },
              CustomGroupMemberIdentities: {
                createMany: {
                  data: args.inputs.members
                    .filter((members) => members.entityType === EntityType.Identity)
                    .map((memberIdentity) => ({ identityId: memberIdentity.id })),
                },
              },
            },
          },
        },
      },
    },
  });

  return customGroupEntity.Group?.id as string;
};
