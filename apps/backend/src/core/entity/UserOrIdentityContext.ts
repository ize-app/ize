import { GraphqlRequestContext } from "@/graphql/context";

import { IdentityPrismaType } from "../entity/identity/identityPrismaTypes";

interface IdentityContext {
  type: "user";
  context: GraphqlRequestContext;
}

interface UserContext {
  type: "identity";
  identity: IdentityPrismaType;
}

// consistent interface for functions that can be called by both users and identities
export type UserOrIdentityContextInterface = IdentityContext | UserContext;
