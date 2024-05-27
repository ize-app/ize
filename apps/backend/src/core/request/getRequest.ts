import { QueryGetRequestArgs, Request } from "@/graphql/generated/resolver-types";

import { requestInclude } from "./requestPrismaTypes";
import { requestResolver } from "./resolvers/requestResolver";
import { GraphqlRequestContext } from "../../graphql/context";
import { prisma } from "../../prisma/client";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";

export const getRequest = async ({
  args,
  context,
}: {
  args: QueryGetRequestArgs;
  context: GraphqlRequestContext;
}): Promise<Request> => {
  return await prisma.$transaction(async (transaction) => {
    const request = await transaction.request.findFirstOrThrow({
      where: { id: args.requestId },
      include: requestInclude,
    });
    const userGroupIds = await getGroupIdsOfUser({ user: context.currentUser });
    return requestResolver({ req: request, context, userGroupIds });
  });
};
