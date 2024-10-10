import { UserPrismaType } from "./userPrismaTypes";

export const getUserEntityIds = (user?: UserPrismaType | undefined | null): string[] => {
  if (!user) return [];
  const identityIds = user.Identities.map((id) => id.entityId);
  const entityIds = [...identityIds];
  entityIds.push(user.entityId);
  return entityIds;
};
