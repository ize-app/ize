import { DiscordApi } from "@discord/api";
import { Prisma } from "@prisma/client";
import { User } from "@graphql/generated/resolver-types";

export const userInclude = Prisma.validator<Prisma.UserInclude>()({
  discordData: true,
});

type UserPrismaType = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;

export const formatUser = (user: UserPrismaType): User => ({
  __typename: "User",
  id: user.id,
  name: user.discordData.username,
  icon: DiscordApi.createAvatarURL(user.discordData.discordId, user.discordData.avatar),
  createdAt: user.createdAt.toString(),
  discordData: user.discordData,
});
