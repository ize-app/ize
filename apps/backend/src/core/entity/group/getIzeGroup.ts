import { createIzeGroupInclude } from "@/core/entity/group/groupPrismaTypes";
import { GraphqlRequestContext } from "@/graphql/context";
import { IzeGroup } from "@/graphql/generated/resolver-types";
import { prisma } from "@/prisma/client";

import { izeGroupResolver } from "./izeGroupResolver";

export const getIzeGroup = async ({
  groupId,
  context,
}: {
  groupId: string;
  context: GraphqlRequestContext;
  getWatchAndPermissionStatus: boolean;
}): Promise<IzeGroup> => {
  const izeGroup = await prisma.groupIze.findFirstOrThrow({
    include: createIzeGroupInclude(context.userEntityIds),
    where: { groupId },
  });

  return izeGroupResolver({ izeGroup, context });
};
