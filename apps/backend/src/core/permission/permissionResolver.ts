import { Permission } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { PermissionPrismaType } from "./permissionPrismaTypes";
import { identityResolver } from "../entity/identity/identityResolver";
import { groupResolver } from "../entity/group/groupResolver";

export const permissionResolver = (
  permission: PermissionPrismaType | null,
  userIdentityIds: string[],
): Permission => {
  if (!permission) return { stepTriggered: false, anyone: false, entities: [] };

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
    stepTriggered: permission.stepTriggered,
    anyone: permission.anyone,
    entities,
  };
};
