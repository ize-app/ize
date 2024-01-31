import { Prisma } from "@prisma/client";
import { GraphqlRequestContext } from "@/graphql/context";
import { prisma } from "@/prisma/client";
import { AgentType, MutationNewCustomGroupArgs } from "@/graphql/generated/resolver-types";

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
  const customGroup = await transaction.group.create({
    data: {
      creatorId: context.currentUser?.id,
      GroupCustom: {
        create: {
          name: args.inputs.name,
          CustomGroupMemberGroups: {
            createMany: {
              data: args.inputs.members
                .filter((members) => members.agentType === AgentType.Group)
                .map((memberGroup) => ({ groupId: memberGroup.id })),
            },
          },
          CustomGroupMemberIdentities: {
            createMany: {
              data: args.inputs.members
                .filter((members) => members.agentType === AgentType.Identity)
                .map((memberIdentity) => ({ identityId: memberIdentity.id })),
            },
          },
        },
      },
    },
  });
  return customGroup.id;
};
