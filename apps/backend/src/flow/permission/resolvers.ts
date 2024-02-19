import { Permission } from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { PermissionPrismaType } from "./types";
import { identityResolver } from "../identity/resolvers";
import { resolveGroup } from "../group/resolvers";

export const permissionResolver = (
  permission: PermissionPrismaType,
  userIdentityIds: string[],
): Permission => {
  const entities = permission.EntitySet?.EntitySetEntities.map((entity) => {
    if (entity.Entity.Group) return resolveGroup(entity.Entity.Group);
    else if (entity.Entity.Identity)
      return identityResolver(entity.Entity.Identity, userIdentityIds);
    else
      throw new GraphQLError("Invalid entity type.", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  });

  return {
    stepTriggered: permission.stepTriggered,
    anyone: permission.anyone,
    entities,
  };
};
