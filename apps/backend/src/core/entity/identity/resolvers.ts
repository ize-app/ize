import { Identity } from "@graphql/generated/resolver-types";
import { DiscordApi } from "@/discord/api";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { IdentityPrismaType } from "./types";

export const identityResolver = (
  identity: IdentityPrismaType,
  userIdentityIds: string[],
  obscure = true,
): Identity => {
  if (identity.IdentityBlockchain)
    return {
      __typename: "Identity",
      id: identity.id,
      entityId: identity.entityId,
      name: identity.IdentityBlockchain.ens ?? identity.IdentityBlockchain.address,
      // TODO: replace with avatar logo
      icon: null,
      identityType: { __typename: "IdentityBlockchain", ...identity.IdentityBlockchain },
    };
  else if (identity.IdentityEmail) {
    const isUserIdentity =
      userIdentityIds.some((identityId) => identityId === identity.id) ?? false;
    return {
      __typename: "Identity",
      id: identity.id,
      entityId: identity.entityId,
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
      entityId: identity.entityId,
      name: identity.IdentityDiscord.username,
      icon: identity.IdentityDiscord.avatar
        ? DiscordApi.createAvatarURL(
            identity.IdentityDiscord.discordUserId,
            identity.IdentityDiscord.avatar,
          )
        : null,
      identityType: { __typename: "IdentityDiscord", ...identity.IdentityDiscord },
    };
  else
    throw new GraphQLError("Invalid identity type.", {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
};
