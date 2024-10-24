// import { FlowType, Prisma } from "@prisma/client";

// import { UserOrIdentityContextInterface } from "@/core/entity/UserOrIdentityContext";
// import { EvolveFlowArgs } from "@/graphql/generated/resolver-types";

// import { createEvolveFlowFlowArgs } from "./createEvolveFlowFlowArgs";
// import { newFlow } from "../../newFlow";

// export const newEvolveFlow = async ({
//   evolveArgs,
//   entityContext,
//   transaction,
// }: {
//   evolveArgs: EvolveFlowArgs;
//   transaction: Prisma.TransactionClient;
//   entityContext: UserOrIdentityContextInterface;
// }): Promise<string> => {
//   const args = createEvolveFlowFlowArgs(evolveArgs);
//   const flowId = await newFlow({
//     type: FlowType.Evolve,
//     args,
//     entityContext,
//     transaction,
//   });

//   return flowId;
// };
