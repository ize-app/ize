import { Prisma } from "@prisma/client";

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

export const groupIzeInclude = Prisma.validator<Prisma.GroupIzeInclude>()({});

export type GroupIzePrismaType = Prisma.GroupIzeGetPayload<{
  include: typeof groupIzeInclude;
}>;

export const groupTelegramChatInclude = Prisma.validator<Prisma.GroupTelegramChatInclude>()({});

export type GroupTelegramChatPrismaType = Prisma.GroupTelegramChatGetPayload<{
  include: typeof groupTelegramChatInclude;
}>;

export const groupInclude = Prisma.validator<Prisma.GroupInclude>()({
  // Creator: {
  //   include: {
  //     User: {
  //       include: userInclude,
  //     },
  //     Identity: {
  //       include: identityInclude,
  //     },
  //   },
  // },
  GroupDiscordRole: {
    include: groupDiscordInclude,
  },
  GroupNft: {
    include: groupNftInclude,
  },
  GroupIze: {
    include: groupIzeInclude,
  },
  GroupTelegramChat: {
    include: groupTelegramChatInclude,
  },
});

export type GroupPrismaType = Prisma.GroupGetPayload<{
  include: typeof groupInclude;
}>;
