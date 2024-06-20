import { PermissionPrismaType } from "./permissionPrismaTypes";

export const hasReadPermission = ({
  permission,
  groupIds,
  identityIds,
  userId,
}: {
  permission: PermissionPrismaType | null;
  groupIds: string[] | null;
  identityIds: string[] | null;
  userId: string | undefined;
}): boolean => {
  if (!userId) return false; // if not logged in, no permission
  if (!permission) return false;
  if (permission.anyone) return true;
  if (permission.userId && permission.userId === userId) return true;
  if (permission.EntitySet) {
    const hasEntityPermission = permission.EntitySet.EntitySetEntities.some((entity) => {
      if (entity.Entity.Group && (groupIds ?? []).includes(entity.Entity.Group.id)) return true;
      else if (entity.Entity.Identity && (identityIds ?? []).includes(entity.Entity.Identity.id))
        return true;
      else return false;
    });
    if (hasEntityPermission) return true;
  }
  return false;
};
