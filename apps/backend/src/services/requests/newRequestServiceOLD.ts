// import { prisma } from "../../prisma/client";
// import { Prisma } from "@prisma/client";
// import { GraphqlRequestContext } from "../../graphql/context";
// import { MutationNewRequestArgs, RoleType } from "@graphql/generated/resolver-types";

// import { roleSetInclude } from "../../utils/formatProcess";
// import { validateRequestInputs } from "./validateRequestInputs";
// import hasRolePermission from "../processes/permission/hasRolePermisssion";

// export const newRequestService = async (
//   {
//     args,
//     transaction = prisma,
//   }: {
//     args: MutationNewRequestArgs;
//     transaction?: Prisma.TransactionClient;
//   },
//   context: GraphqlRequestContext,
// ) => {
//   if (!context.currentUser) throw Error("ERROR Unauthenticated user");

//   const { processId, requestInputs } = args;

//   const process = await transaction.process.findFirstOrThrow({
//     include: {
//       currentProcessVersion: {
//         include: {
//           inputTemplateSet: {
//             include: {
//               inputTemplates: true,
//             },
//           },
//           roleSet: {
//             include: roleSetInclude,
//           },
//         },
//       },
//     },
//     where: {
//       id: processId,
//     },
//   });

//   if (!process.currentProcessVersionId || !process.currentProcessVersion)
//     throw Error("ERROR New Request: Can't find current process version");

//   if (
//     validateRequestInputs(args.requestInputs ?? [], process.currentProcessVersion?.inputTemplateSet)
//   )
//     throw Error("ERROR New Request: Invalid request inputs");

//   if (
//     await !hasRolePermission({
//       roleType: RoleType.Request,
//       context,
//       processVersionId: process.currentProcessVersionId,
//     })
//   )
//     throw Error("Invalid permissions for creating request");

//   const request = await transaction.request.create({
//     data: {
//       processVersionId: process.currentProcessVersionId as string,
//       creatorId: context.currentUser.id,
//       expirationDate: new Date(
//         new Date().getTime() + (process?.currentProcessVersion?.expirationSeconds as number) * 1000,
//       ),
//       requestInputs: {
//         create: requestInputs ?? [],
//       },
//     },
//   });

//   return request.id;
// };
