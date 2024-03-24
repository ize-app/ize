import { RequestNew, QueryGetRequestArgs } from "@/graphql/generated/resolver-types";
import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { requestInclude } from "./requestTypes";
import { requestResolver } from "./resolvers/requestResolver";
import { getGroupIdsOfUser } from "../entity/group/getGroupIdsOfUser";

export const getRequest = async ({
  args,
  context,
}: {
  args: QueryGetRequestArgs;
  context: GraphqlRequestContext;
}): Promise<RequestNew> => {
  return await prisma.$transaction(async (transaction) => {
    const request = await transaction.requestNew.findFirstOrThrow({
      where: { id: args.requestId },
      include: requestInclude,
    });
    const userGroupIds = await getGroupIdsOfUser({ user: context.currentUser });
    return requestResolver({ req: request, context, userGroupIds });
  });
};
