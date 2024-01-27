import * as z from "zod";

import { prisma } from "../../prisma/client";
import { GraphqlRequestContext } from "../../graphql/context";
import { NewAgentArgs } from "@graphql/generated/resolver-types";
import { IdentityPrismaType, formatIdentity } from "@/utils/formatIdentity";

export const upsertEmailIdentity = async ({
  newAgent,
  context,
}: {
  newAgent: NewAgentArgs;
  context: GraphqlRequestContext;
}) => {
  if (!newAgent.identityEmail) throw Error("ERROR: upsertIdentityEmail - missing identityEmail");
  if (!z.string().email().safeParse(newAgent.identityEmail.email).success)
    throw Error("Error:  upsertIdentityEmail - invalid email");

  const res = await prisma.identityEmail.upsert({
    include: {
      Identity: {
        include: {
          IdentityEmail: true,
        },
      },
    },
    where: {
      email: newAgent.identityEmail.email,
    },
    update: {},
    create: {
      email: newAgent.identityEmail.email,
      Identity: {
        create: {},
      },
    },
  });

  return formatIdentity(res.Identity as IdentityPrismaType, context.currentUser);
};
