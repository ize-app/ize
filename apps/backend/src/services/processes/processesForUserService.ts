import { Prisma } from "@prisma/client";
import { prisma } from "@/prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { formatProcess, processInclude } from "@utils/formatProcess";
import { Process, QueryProcessesForCurrentUserArgs } from "@graphql/generated/resolver-types";
import { getGroupIdsOfUser } from "../groups/getGroupIdsOfUser";

/* 
Gets all processes that either 
1) give request/respond permissions to that group/user
2) have an evovle process with reqest permissions to that group/user 
Note: In the process table UI, "evolve processes" are not shown by themselves, only as attached to their "parent" process
*/
export const processesForUserService = async ({
  args,
  context,
  transaction = prisma,
}: {
  args: QueryProcessesForCurrentUserArgs;
  context: GraphqlRequestContext;
  transaction?: Prisma.TransactionClient;
}): Promise<Process[]> => {
  if (!context.currentUser) return [];

  const identityIds = context.currentUser.Identities.map((identity) => identity.id);

  const groupIds = await getGroupIdsOfUser({ user: context.currentUser, transaction });

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
                        { groupId: { in: groupIds } },
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
                            { groupId: { in: groupIds } },
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
  const formattedProcesses = processes.map((process) =>
    formatProcess(process, context.currentUser, groupIds),
  );

  return formattedProcesses;
};
