type DiscordImageSize = 16|32|64|128|256|512|1024|2048|4096

export const createDiscordAvatarURL = (discordId:string, avatarHash: string, size:DiscordImageSize):string =>
`https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png${size ? `?size=${size}` : ''}`;
