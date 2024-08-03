import { Entity } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { EntityPrismaType } from "./entityPrismaTypes";
import { groupResolver } from "./group/groupResolver";
import { identityResolver } from "./identity/identityResolver";

export const entityResolver = ({
  entity,
  userIdentityIds = [],
}: {
  entity: EntityPrismaType;
  userIdentityIds?: string[];
}): Entity => {
  if (entity.Group) return groupResolver(entity.Group);
  else if (entity.Identity) return identityResolver(entity.Identity, userIdentityIds);
  else
    throw new GraphQLError("Invalid entity type.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
};
