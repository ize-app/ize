import { Email } from "stytch";

import { UserPrismaType } from "@/core/user/userPrismaTypes";
import { prisma } from "@/prisma/client";

// creates email identities in db if they don't exist yet
// TODO: passing in the profilePictureURL is a hack and
// will associate the wrong url with the wrong user in some edge cases
export const createEmailIdentities = async (
  user: UserPrismaType,
  stytchEmails: Email[],
  profilePictureURL?: string | undefined,
) => {
  stytchEmails.forEach(async (email) => {
    const userEmail = (user.Identities ?? []).find((identity) => {
      identity.IdentityEmail?.email === email.email && email.verified;
    });

    if (!userEmail) {
      const existingIdentity = await prisma.identityEmail.findFirst({
        where: {
          email: email.email,
        },
      });
      if (!existingIdentity) {
        // if there isn't an existing identity for this address, create it
        await prisma.identity.create({
          data: {
            User: {
              connect: {
                id: user.id,
              },
            },
            Entity: {
              create: {},
            },
            IdentityEmail: {
              create: {
                email: email.email,
                icon: profilePictureURL ?? null,
              },
            },
          },
        });
      } else {
        // otherwise associate existing identity with this user
        await prisma.identity.update({
          where: {
            id: existingIdentity.identityId,
          },
          data: {
            userId: user.id,
          },
        });
      }
    }
  });
};
