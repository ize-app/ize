import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "@utils/formatProcess";
import { Process, QueryProcessesForCurrentUserArgs } from "@graphql/generated/resolver-types";

/* 
Gets all processes that either 
1) give request/respond permissions to that group/user
2) have an evovle process with reqest permissions to that group/user 
Note: In the process table UI, "evolve processes" are not shown by themselves, only as attached to their "parent" process
*/
export const processesForUserService = async (
  args: QueryProcessesForCurrentUserArgs,
  context: GraphqlRequestContext,
): Promise<Process[]> => {
  if (!context.currentUser) throw Error("ERROR processesForCurrentUser: No user is authenticated");

  const identityIds = context.currentUser.Identities.map((identity) => identity.id);

  const processes = await prisma.process.findMany({
    where: {
      OR: [
        {
          currentProcessVersion: {
            roleSet: {
              OR: [
                {
                  RoleGroups: {
                    some: {
                      AND: [
                        { groupId: { in: args.groupIds ?? [] } },
                        {
                          type: {
                            in: args.requestRoleOnly ? ["Request"] : ["Request", "Respond"],
                          },
                        },
                      ],
                    },
                  },
                },
                {
                  RoleIdentities: {
                    some: {
                      AND: [
                        { identityId: { in: identityIds } },
                        {
                          type: {
                            in: args.requestRoleOnly ? ["Request"] : ["Request", "Respond"],
                          },
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
        {
          currentProcessVersion: {
            evolveProcess: {
              currentProcessVersion: {
                roleSet: {
                  OR: [
                    {
                      RoleGroups: {
                        some: {
                          AND: [
                            { groupId: { in: args.groupIds ?? [] } },
                            {
                              type: "Request",
                            },
                          ],
                        },
                      },
                    },
                    {
                      RoleIdentities: {
                        some: {
                          AND: [
                            { identityId: { in: identityIds } },
                            {
                              type: "Request",
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      ],
      type: { not: "Evolve" },
    },
    include: processInclude,
  });
  const formattedProcesses = processes.map((process) => formatProcess(process));

  return formattedProcesses;
};
