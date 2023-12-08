type DiscordImageSize = 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096;

export const createDiscordAvatarURL = (
  discordId: string,
  avatarHash: string,
  size: DiscordImageSize,
): string => createDiscordImageUrl(discordId, avatarHash, size, "avatars");

export const createDiscordIconURL = (
  discordId: string,
  avatarHash: string,
  size: DiscordImageSize,
): string => createDiscordImageUrl(discordId, avatarHash, size, "icons");

const createDiscordImageUrl = (
  discordId: string,
  avatarHash: string,
  size: DiscordImageSize,
  type: "avatars" | "icons",
): string =>
  `https://cdn.discordapp.com/${type}/${discordId}/${avatarHash}.png${size ? `?size=${size}` : ""}`;
