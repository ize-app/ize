import { DiscordApi } from "@/discord/api";
import { User } from "@graphql/generated/resolver-types";

import { UserPrismaType } from "./userPrismaTypes";

export const userResolver = (user: UserPrismaType): User => {
  return {
    __typename: "User",
    id: user.id,
    entityId: user.entityId,
    name: user.name,
    createdAt: user.createdAt.toISOString(),
    icon: findFirstIdentityIcon(user),
  };
};

export const findFirstIdentityIcon = (user: UserPrismaType): string | null => {
  const identities = user.Identities;
  for (const identity of identities) {
    if (identity.IdentityBlockchain) {
      continue;
    } else if (identity.IdentityEmail && identity.IdentityEmail.icon) {
      return identity.IdentityEmail.icon;
    } else if (identity.IdentityDiscord && identity.IdentityDiscord.avatar) {
      return DiscordApi.createAvatarURL(
        identity.IdentityDiscord.discordUserId,
        identity.IdentityDiscord.avatar,
      );
    }
  }
  return null;
};
