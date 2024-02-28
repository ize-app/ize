import { IdentityPrismaType } from "@/flow/identity/types";

// checks whether one of a user's identities are assigned a role
// for a given set of request or respond roles.
export const hasIdentityPermission = async ({
  identities,
  userIdentities,
}: {
  identities: IdentityPrismaType[];
  userIdentities: IdentityPrismaType[];
}): Promise<boolean> => {
  const userIdentityIds = userIdentities.map((identity) => identity.id);

  return identities.some((id) => userIdentityIds.includes(id.id));
};
