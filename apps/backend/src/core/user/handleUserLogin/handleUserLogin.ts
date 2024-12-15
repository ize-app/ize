import { TelegramUserData } from "@telegram-auth/server";
import { Response } from "express";
import {
  MagicLinksAuthenticateResponse,
  OAuthAuthenticateResponse,
  OAuthProvider,
  SessionsAuthenticateResponse,
} from "stytch";

import { MePrismaType } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";
import { upsertOauthToken } from "@/stytch/upsertOauthToken";
import { upsertUser } from "@/stytch/upsertUser";
import { upsertTelegramIdentity } from "@/telegram/upsertTelegramIdentity";

import { upsertUserBlockchainIdentities } from "./upsertUserBlockchainIdentities";
import { upsertUserDiscordIdentity } from "./upsertUserDiscordIdentity";
import { upsertUserEmailIdentities } from "./upsertUserEmailIdentities";
import { upsertUserEntityGroups } from "../updateUserEntityGroups/updateUserGroups";

export enum LoginTypes {
  Blockchain = "Blockchain",
  Oauth = "Oauth",
  MagicLink = "MagicLink",
  Telegram = "Telegram",
  Password = "Password",
}

interface UserLoginPropsBase {
  res: Response;
}

interface BlockchainLoginProps extends UserLoginPropsBase {
  type: LoginTypes.Blockchain;
  stytchSession: SessionsAuthenticateResponse;
}

interface OauthLoginProps extends UserLoginPropsBase {
  type: LoginTypes.Oauth;
  stytchOAuthentication: OAuthAuthenticateResponse;
}

interface MagicLinkLoginProps extends UserLoginPropsBase {
  type: LoginTypes.MagicLink;
  stytchMagicLinkAuthentication: MagicLinksAuthenticateResponse;
}

interface PasswordLoginProps extends UserLoginPropsBase {
  type: LoginTypes.Password;
  stytchSession: SessionsAuthenticateResponse;
}

interface TelegramLoginProps extends UserLoginPropsBase {
  type: LoginTypes.Telegram;
  user: MePrismaType;
  telegramUserData: TelegramUserData;
}

type NewUserIdentityProps =
  | BlockchainLoginProps
  | OauthLoginProps
  | MagicLinkLoginProps
  | PasswordLoginProps
  | TelegramLoginProps;

// used for both login and
// upserts user and user identities if they don't exist
// updates all entities_groups for that user
export const handleUserLogin = async ({ res, ...props }: NewUserIdentityProps) => {
  const user = await prisma.$transaction(async (transaction) => {
    let user: MePrismaType;

    switch (props.type) {
      case LoginTypes.Blockchain: {
        const stytchUser = props.stytchSession.user;
        user = await upsertUser({ stytchUser: stytchUser, res: res, transaction });
        await upsertUserBlockchainIdentities({
          user,
          transaction,
          stytchWallets: stytchUser.crypto_wallets,
        });
        break;
      }
      case LoginTypes.Oauth: {
        user = await upsertUser({
          stytchUser: props.stytchOAuthentication.user,
          res: res,
          transaction,
        });
        await upsertOauthToken({
          stytchOAuthentication: props.stytchOAuthentication,
          user,
          transaction,
        });
        if (props.stytchOAuthentication.provider_type === "Discord") {
          await upsertUserDiscordIdentity({
            userId: user.id,
            accessToken: props.stytchOAuthentication.provider_values.access_token,
            transaction,
          });
        } else if (props.stytchOAuthentication.provider_type === "Google") {
          const providerDetails: OAuthProvider | undefined =
            props.stytchOAuthentication.user.providers.find((provider) => {
              return (
                provider.oauth_user_registration_id ===
                props.stytchOAuthentication.oauth_user_registration_id
              );
            });
          await upsertUserEmailIdentities({
            user,
            stytchEmails: props.stytchOAuthentication.user.emails,
            profilePictureURL: providerDetails?.profile_picture_url,
            transaction,
          });
        }
        break;
      }
      case LoginTypes.MagicLink: {
        user = await upsertUser({
          stytchUser: props.stytchMagicLinkAuthentication.user,
          res,
          transaction,
        });
        await upsertUserEmailIdentities({
          user,
          stytchEmails: props.stytchMagicLinkAuthentication.user.emails,
          transaction,
        });
        break;
      }
      case LoginTypes.Password: {
        const stytchUser = props.stytchSession.user;
        user = await upsertUser({ stytchUser: stytchUser, res: res, transaction });
        await upsertUserEmailIdentities({
          user,
          stytchEmails: stytchUser.emails,
          transaction,
        });
        break;
      }
      case LoginTypes.Telegram: {
        user = props.user;
        await upsertTelegramIdentity({
          telegramUserData: props.telegramUserData,
          userId: user?.id,
        });
        break;
      }
      default:
        throw new Error("Identity type not supported");
    }
    return user;
  });

  await upsertUserEntityGroups({ userId: user.id });
};
