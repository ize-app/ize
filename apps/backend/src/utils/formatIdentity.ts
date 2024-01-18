import { Prisma } from "@prisma/client";
import { Identity } from "@graphql/generated/resolver-types";
import { DiscordApi } from "@/discord/api";
import { MePrismaType } from "./formatUser";

export const identityInclude = Prisma.validator<Prisma.IdentityInclude>()({
  IdentityBlockchain: true,
  IdentityDiscord: true,
  IdentityEmail: true,
});

export type IdentityPrismaType = Prisma.IdentityGetPayload<{
  include: typeof identityInclude;
}>;

export const formatIdentity = (
  identity: IdentityPrismaType,
  user: MePrismaType | undefined | null,
  obscure = true,
): Identity => {
  if (identity.IdentityBlockchain)
    return {
      __typename: "Identity",
      id: identity.id,
      name: identity.IdentityBlockchain.address,
      // TODO: replace with avatar logo
      icon: null,
      identityType: { __typename: "IdentityBlockchain", ...identity.IdentityBlockchain },
    };
  else if (identity.IdentityEmail) {
    const isUserIdentity = user?.Identities.some((userId) => userId.id === identity.id) ?? false;
    return {
      __typename: "Identity",
      id: identity.id,
      // only show email address if it's user's own identity
      name:
        !obscure || isUserIdentity
          ? identity.IdentityEmail.email
          : identity.IdentityEmail.email.replace(/(\w{1})[\w.-]+@([\w.]+\w)/, "$1***@$2"),
      icon: identity.IdentityEmail.icon,
      identityType: { __typename: "IdentityEmail", ...identity.IdentityEmail },
    };
  } else if (identity.IdentityDiscord)
    return {
      __typename: "Identity",
      id: identity.id,
      name: identity.IdentityDiscord.username,
      icon: identity.IdentityDiscord.avatar
        ? DiscordApi.createAvatarURL(
            identity.IdentityDiscord.discordUserId,
            identity.IdentityDiscord.avatar,
          )
        : null,
      identityType: { __typename: "IdentityDiscord", ...identity.IdentityDiscord },
    };
  else throw Error("ERROR: Unrecognized identity");
};
