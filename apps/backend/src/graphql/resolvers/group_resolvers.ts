import {
  ProcessConfigurationOption,
  setUpDiscordServerGroup as createDiscordServerGroupService,
} from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "../context";

const createDiscordServerGroup = async (
  root: unknown,
  args: {
    input: {
      serverId: string;
      processConfigurationOption: ProcessConfigurationOption;
      roleId?: string;
      numberOfResponses?: number;
    };
  },
  context: GraphqlRequestContext
) => {
  return await createDiscordServerGroupService(args.input, context);
};

export const groupMutations = {
  createDiscordServerGroup,
};
