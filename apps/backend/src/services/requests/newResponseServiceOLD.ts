// import { prisma } from "../../prisma/client";
// import { Prisma } from "@prisma/client";
// import { GraphqlRequestContext } from "../../graphql/context";
// import { MutationNewResponseArgs, RoleType } from "@graphql/generated/resolver-types";

// import hasRolePermission from "../processes/permission/hasRolePermisssion";
// import { resultInclude } from "@/utils/formatResult";
// import determineDecision from "../decisions/determineDecision";

// export const newResponseService = async ({
//   args,
//   transaction = prisma,
//   context,
// }: {
//   args: MutationNewResponseArgs;
//   transaction?: Prisma.TransactionClient;
//   context: GraphqlRequestContext;
// }): Promise<string> => {
//   if (!context.currentUser) throw Error("ERROR Unauthenticated user");

//   const existingResponse = await prisma.response.findFirst({
//     where: {
//       requestId: args.requestId,
//       creatorId: context.currentUser.id,
//     },
//   });

//   if (existingResponse) throw Error("ERROR User already responded to this request ");

//   const request = await prisma.request.findFirstOrThrow({
//     include: {
//       result: { include: resultInclude },
//     },
//     where: {
//       id: args.requestId,
//     },
//   });

//   if (request.expirationDate < new Date() || request.result)
//     throw Error("ERROR New Response: Request is no longer accepting responses");

//   if (
//     await !hasRolePermission({
//       roleType: RoleType.Respond,
//       context,
//       processVersionId: request.processVersionId,
//     })
//   )
//     throw Error("Invalid permissions for creating request");

//   const response = await prisma.response.create({
//     data: {
//       optionId: args.optionId,
//       requestId: args.requestId,
//       creatorId: context.currentUser.id,
//     },
//   });

//   await determineDecision({ requestId: args.requestId, user: context.currentUser });

//   return response.id;
// };
