import { Prisma } from "@prisma/client";

import { entityInclude, entitySetInclude } from "../entityPrismaTypes";

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

export const createIzeGroupInclude = (userEntityIds: string[]) =>
  Prisma.validator<Prisma.GroupIzeInclude>()({
    NotificationEntity: {
      include: entityInclude,
    },
    MemberEntitySet: {
      include: entitySetInclude,
    },
    group: {
      include: {
        ...groupInclude,
        Creator: { include: entityInclude },
        OwnedFlows: true,
        EntitiesInGroup: {
          where: {
            entityId: { in: userEntityIds },
            active: true,
          },
        },
        EntityWatchedGroups: {
          where: {
            entityId: { in: userEntityIds },
            watched: true,
          },
        },
      },
    },
  });

export type GroupPrismaType = Prisma.GroupGetPayload<{
  include: typeof groupInclude;
}>;

const exampleIzeGroupInclude = createIzeGroupInclude([]);

export type IzeGroupPrismaType = Prisma.GroupIzeGetPayload<{
  include: typeof exampleIzeGroupInclude;
}>;
