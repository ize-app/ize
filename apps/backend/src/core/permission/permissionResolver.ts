import { Permission } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { PermissionPrismaType } from "./permissionPrismaTypes";
import { groupResolver } from "../entity/group/groupResolver";
import { identityResolver } from "../entity/identity/identityResolver";

export const permissionResolver = (
  permission: PermissionPrismaType,
  userIdentityIds: string[],
): Permission => {
  if (!permission) return { stepTriggered: true, anyone: false, entities: [] };

  const entities = permission.EntitySet
    ? permission.EntitySet.EntitySetEntities.map((entity) => {
        if (entity.Entity.Group) return groupResolver(entity.Entity.Group);
        else if (entity.Entity.Identity)
          return identityResolver(entity.Entity.Identity, userIdentityIds);
        else
          throw new GraphQLError("Invalid entity type.", {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });
      })
    : [];

  return {
    stepTriggered: false,
    anyone: permission.anyone,
    entities,
  };
};
