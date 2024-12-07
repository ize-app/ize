import { UserPrismaType } from "./userPrismaTypes";

export const getUserEntityIds = (user?: UserPrismaType | undefined | null): string[] => {
  if (!user) return [];
  const entityIds = [];
  user.Identities.map((id) => entityIds.push(id.entityId));
  entityIds.push(user.entityId);
  return entityIds;
};
 