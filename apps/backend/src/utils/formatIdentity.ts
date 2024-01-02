import { Prisma } from "@prisma/client";
import { Identity } from "@graphql/generated/resolver-types";
import { DiscordApi } from "@/discord/api";

export const identityInclude = Prisma.validator<Prisma.IdentityInclude>()({
  IdentityBlockchain: true,
  IdentityDiscord: true,
  IdentityEmail: true,
});

export type IdentityPrismaType = Prisma.IdentityGetPayload<{
  include: typeof identityInclude;
}>;

export const formatIdentity = (identity: IdentityPrismaType): Identity => {
  if (identity.IdentityBlockchain)
    return {
      id: identity.id,
      name: identity.IdentityBlockchain.address,
      // TODO: replace with avatar logo
      icon: null,
      identityType: { __typename: "IdentityBlockchain", ...identity.IdentityBlockchain },
    };
  else if (identity.IdentityEmail)
    return {
      id: identity.id,
      // TODO: obfuscate
      name: identity.IdentityEmail.email,
      icon: identity.IdentityEmail.icon,
      identityType: { __typename: "IdentityEmail", ...identity.IdentityEmail },
    };
  else if (identity.IdentityDiscord)
    return {
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
