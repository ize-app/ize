import { OauthTypes, Prisma } from "@prisma/client";
import { OAuthAuthenticateResponse } from "stytch";

import { UserPrismaType } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";
import { encrypt } from "@/prisma/encrypt";

export const upsertOauthToken = async ({
  stytchOAuthentication,
  user,
  // transaction = prisma,
}: {
  user: UserPrismaType;
  stytchOAuthentication: OAuthAuthenticateResponse;
  transaction?: Prisma.TransactionClient;
}) => {
  const encryptedAccessToken = encrypt(stytchOAuthentication.provider_values.access_token);
  const encryptedRefreshToken = encrypt(stytchOAuthentication.provider_values.refresh_token);

  await prisma.oauths.upsert({
    where: {
      id: { userId: user.id, type: stytchOAuthentication.provider_type as OauthTypes },
    },
    update: {
      type: stytchOAuthentication.provider_type as OauthTypes,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      scopes: stytchOAuthentication.provider_values.scopes,
      expiresAt: stytchOAuthentication.provider_values.expires_at,
    },
    create: {
      userId: user.id,
      type: stytchOAuthentication.provider_type as OauthTypes,
      accessToken: encryptedAccessToken,
      refreshToken: encryptedRefreshToken,
      scopes: stytchOAuthentication.provider_values.scopes,
      expiresAt: stytchOAuthentication.provider_values.expires_at,
    },
  });
};
