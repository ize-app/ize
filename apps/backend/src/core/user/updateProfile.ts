import { GraphQLError } from "graphql";

import { CustomErrorCodes } from "@/graphql/errors";
import { MutationUpdateProfileArgs } from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";

export const updateProfile = async ({
  args,
  context,
}: {
  args: MutationUpdateProfileArgs;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  if (!context.currentUser)
    throw new GraphQLError("Unauthenticated", {
      extensions: { code: CustomErrorCodes.Unauthenticated },
    });

  await prisma.user.update({
    where: {
      id: context.currentUser.id,
    },
    data: {
      firstName: args.profile.name,
    },
  });
  return true;
};
