import { DiscordApi } from "@/discord/api";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";
import { Identity } from "@graphql/generated/resolver-types";

import { displayEthAddress } from "./displayEthAddress";
import { IdentityPrismaType } from "./identityPrismaTypes";

export const identityResolver = (
  identity: IdentityPrismaType,
  userIdentityIds: string[],
  obscure = true,
  useIdentityName = false,
): Identity => {
  const userName = !useIdentityName ? identity.User?.name : null;
  console.log("userName", userName);
  if (identity.IdentityBlockchain)
    return {
      __typename: "Identity",
      id: identity.id,
      entityId: identity.entityId,
      name:
        identity.IdentityBlockchain.ens ?? displayEthAddress(identity.IdentityBlockchain.address),
      // TODO: replace with avatar logo
      icon: null,
      identityType: {
        __typename: "IdentityBlockchain",
        id: identity.IdentityBlockchain.id,
        address: identity.IdentityBlockchain.address,
      },
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
        userName ??
        (!obscure || isUserIdentity
          ? identity.IdentityEmail.email
          : identity.IdentityEmail.email.replace(/(\w{1})[\w.-]+@([\w.]+\w)/, "$1***@$2")),
      icon: identity.IdentityEmail.icon,
      identityType: { __typename: "IdentityEmail", id: identity.IdentityEmail.id },
    };
  } else if (identity.IdentityDiscord)
    return {
      __typename: "Identity",
      id: identity.id,
      entityId: identity.entityId,
      name: userName ?? identity.IdentityDiscord.username,
      icon: identity.IdentityDiscord.avatar
        ? DiscordApi.createAvatarURL(
            identity.IdentityDiscord.discordUserId,
            identity.IdentityDiscord.avatar,
          )
        : null,
      identityType: { __typename: "IdentityDiscord", id: identity.IdentityDiscord.id },
    };
  else if (identity.IdentityTelegram)
    return {
      __typename: "Identity",
      id: identity.id,
      entityId: identity.entityId,
      name: userName ?? identity.IdentityTelegram.username ?? "Telegram user",
      icon: identity.IdentityTelegram.photoUrl,
      identityType: {
        __typename: "IdentityTelegram",
        id: identity.IdentityTelegram.id,
      },
    };
  else {
    throw new GraphQLError(`Invalid identity type. identityId ${identity.id}`, {
      extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
    });
  }
};
