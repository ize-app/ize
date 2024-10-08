export { ApolloServerErrorCode } from "@apollo/server/errors";
export { GraphQLError } from "graphql";

export enum CustomErrorCodes {
  Unauthenticated = "Unauthenticated",
  InsufficientPermissions = "InsufficientPermissions",
}
