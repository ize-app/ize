import { IdentityPrismaType } from "@/utils/formatIdentity";
import { MePrismaType } from "@/utils/formatUser";

// checks whether one of a user's identities are assigned a role
// for a given set of request or respond roles.
export const hasIdentityPermission = async ({
  identities,
  user,
}: {
  identities: IdentityPrismaType[];
  user: MePrismaType;
}): Promise<boolean> => {
  const userIdentityIds = user.Identities.map((identity) => identity.id);

  return identities.some((id) => userIdentityIds.includes(id.id));
};
