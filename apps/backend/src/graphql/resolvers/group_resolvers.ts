import {
  ProcessConfigurationOption,
  setUpDiscordServerGroup as createDiscordServerGroupService,
} from "@services/groups/discord_server_group";
import { GraphqlRequestContext } from "../context";
import { prisma } from "../../prisma/client";

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

const group = async (
  root: unknown,
  args: {
    id: string;
  }
) => {
  return await prisma.group.findFirst({ where: { id: args.id } });
};

export const groupMutations = {
  createDiscordServerGroup,
};

export const groupQueries = {
  group,
};
