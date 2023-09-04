import { IDiscordServer } from "@discord/server_types";
import { GraphqlRequestContext } from "../context";

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
