import { IdentityPrismaType } from "@/core/entity/identity/identityPrismaTypes";

// checks whether one of a user's identities are assigned a role
// for a given set of request or respond roles.
export const hasIdentityPermission = ({
  identities,
  userIdentities,
}: {
  identities: IdentityPrismaType[];
  userIdentities: IdentityPrismaType[];
}): boolean => {
  const userIdentityIds = userIdentities.map((identity) => identity.id);

  return identities.some((id) => userIdentityIds.includes(id.id));
};
