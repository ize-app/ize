import { EvolveRequestProposedFlowVersionPrismaType } from "./requestPrismaTypes";

// When displaying an evolution request, we want to give context in the flow title about which flow is being evolved
// Since any given "evolve flow" has a static flow name in the data, we want to
// dynamically construct the flow name based on the flow that is being proposed.
// This function pulls the current name of the flow that the request is proposing an evolution for.
export const getEvolveRequestFlowName = ({
  proposedFlowVersion,
}: {
  proposedFlowVersion: EvolveRequestProposedFlowVersionPrismaType | null;
}): string | null => {
  if (!proposedFlowVersion) return null;
  const currentProposedEvolutionFlowName = proposedFlowVersion.Flow.CurrentFlowVersion?.name;
  return `Evolve the "${currentProposedEvolutionFlowName}" flow` ?? null;
};
