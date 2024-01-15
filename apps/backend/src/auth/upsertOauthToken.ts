import { prisma } from "@/prisma/client";
import { OauthTypes, Prisma } from "@prisma/client";
import { UserPrismaType } from "@/utils/formatUser";
import { OAuthAuthenticateResponse } from "stytch";
import { encrypt } from "@/encrypt";

export const upsertOauthToken = async ({
  stytchOAuthentication,
  user,
  transaction = prisma,
}: {
  user: UserPrismaType;
  stytchOAuthentication: OAuthAuthenticateResponse;
  transaction?: Prisma.TransactionClient;
}) => {
  const encryptedAccessToken = encrypt(stytchOAuthentication.provider_values.access_token);
  const encryptedRefreshToken = encrypt(stytchOAuthentication.provider_values.refresh_token);

  await prisma.oauths.upsert({
    where: {
      userId_type: { userId: user.id, type: stytchOAuthentication.provider_type as OauthTypes },
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
