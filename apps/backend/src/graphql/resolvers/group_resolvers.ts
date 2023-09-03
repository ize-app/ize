import { IDiscordServer } from "@discord/server_types";
import { GraphqlRequestContext } from "../context";
import { Guild } from "discord.js";
import { DiscordApi } from "@discord/api";

const createDiscordServerGroup = async (
  root: unknown,
  args: {},
  context: GraphqlRequestContext
): Promise<Array<IDiscordServer>> => {
  return;
};

export const groupMutations = {
  createDiscordServerGroup,
};
