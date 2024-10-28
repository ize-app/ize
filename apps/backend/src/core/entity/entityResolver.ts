import { Entity } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { EntityPrismaType } from "./entityPrismaTypes";
import { groupResolver } from "./group/groupResolver";
import { identityResolver } from "./identity/identityResolver";
import { userResolver } from "../user/userResolver";

export const entityResolver = ({
  entity,
  userIdentityIds = [],
}: {
  entity: EntityPrismaType;
  userIdentityIds?: string[];
}): Entity => {
  if (entity.Group) return groupResolver(entity.Group);
  else if (entity.Identity) return identityResolver(entity.Identity, userIdentityIds);
  else if (entity.User) return userResolver(entity.User);
  else
    throw new GraphQLError("Invalid entity type.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
};
