import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../context";

const logOut = async (root: unknown, args: unknown, context: GraphqlRequestContext) => {
  try {
    const discordOauth = await prisma.discordOauth.delete({
      where: {
        userId: context.currentUser?.id,
      },
    });

    await fetch("https://discord.com/api/oauth2/token/revoke", {
      method: "POST",
      body: new URLSearchParams({
        client_id: process.env.DISCORD_OAUTH_CLIENT_ID as string,
        client_secret: process.env.DISCORD_OAUTH_CLIENT_SECRET as string,
        token: discordOauth.accessToken,
      }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/x-www-form-urlencoded",
      },
    });

    context.clearCookie("token");

    return {
      ok: true,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      error: "Something went wrong.",
    };
  }
};

export const oauthMutations = {
  logOut,
};
