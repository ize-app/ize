import { Prisma } from "@prisma/client";

import { userInclude } from "@/core/user/userPrismaTypes";

export const groupNftInclude = Prisma.validator<Prisma.GroupNftInclude>()({
  NftCollection: true,
});

export type GroupNftPrismaType = Prisma.GroupNftGetPayload<{
  include: typeof groupNftInclude;
}>;

export const groupDiscordInclude = Prisma.validator<Prisma.GroupDiscordRoleInclude>()({
  discordServer: true,
});

export type GroupDiscordPrismaType = Prisma.GroupDiscordRoleGetPayload<{
  include: typeof groupDiscordInclude;
}>;

export const groupCustomInclude = Prisma.validator<Prisma.GroupCustomInclude>()({});

export type GroupCustomPrismaType = Prisma.GroupCustomGetPayload<{
  include: typeof groupCustomInclude;
}>;

export const groupTelegramChatInclude = Prisma.validator<Prisma.GroupTelegramChatInclude>()({});

export type GroupTelegramChatPrismaType = Prisma.GroupTelegramChatGetPayload<{
  include: typeof groupTelegramChatInclude;
}>;

export const groupInclude = Prisma.validator<Prisma.GroupInclude>()({
  creator: {
    include: userInclude,
  },
  GroupDiscordRole: {
    include: groupDiscordInclude,
  },
  GroupNft: {
    include: groupNftInclude,
  },
  GroupCustom: {
    include: groupCustomInclude,
  },
  GroupTelegramChat: {
    include: groupTelegramChatInclude,
  },
});

export type GroupPrismaType = Prisma.GroupGetPayload<{
  include: typeof groupInclude;
}>;
