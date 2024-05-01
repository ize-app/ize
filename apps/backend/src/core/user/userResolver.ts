import { User } from "@graphql/generated/resolver-types";
import { UserPrismaType } from "./userPrismaTypes";
import { DiscordApi } from "@/discord/api";

export const userResolver = (user: UserPrismaType): User => {
  return {
    id: user.id,
    name: user.firstName ? user.firstName + " " + user.lastName : "User",
    createdAt: user.createdAt.toString(),
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
