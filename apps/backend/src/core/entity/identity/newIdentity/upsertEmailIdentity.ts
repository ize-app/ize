import * as z from "zod";

import { NewEntityArgs } from "@graphql/generated/resolver-types";

import { GraphqlRequestContext } from "../../../../graphql/context";
import { prisma } from "../../../../prisma/client";
import { IdentityPrismaType } from "../identityPrismaTypes";
import { identityResolver } from "../identityResolver";

export const upsertEmailIdentity = async ({
  newAgent,
  context,
}: {
  newAgent: NewEntityArgs;
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
        create: {
          Entity: { create: {} },
        },
      },
    },
  });

  return identityResolver(
    res.Identity as IdentityPrismaType,
    context.currentUser?.Identities.map((i) => i.id) ?? [],
    false,
  );
};
