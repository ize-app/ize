import { UpdateProfileArgs } from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../../graphql/context";
// import { prisma } from "../../prisma/client";

export const updateProfile = async ({
  args,
  context,
}: {
  args: UpdateProfileArgs;
  context: GraphqlRequestContext;
}): Promise<boolean> => {
  console.log(args, context);
  return true;
  //   return await prisma.$transaction(async (transaction) => {});
};
