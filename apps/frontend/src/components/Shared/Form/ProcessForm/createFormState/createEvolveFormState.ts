import {
  DecisionTypes,
  Process,
  RoleSummaryPartsFragment,
} from "@/graphql/generated/graphql";

import {
  DefaultEvolveProcessOptions,
  EvolveProcessForm,
} from "@/components/shared/Form/ProcessForm/types";
import createDecisionFormState from "./createDecisionFormState";
import createRolesFormState from "./createRolesFormState";

const createEvolveFormState = (
  evolve: Process | undefined,
): EvolveProcessForm | undefined => {
  return {
    evolveDefaults: DefaultEvolveProcessOptions.Custom,
    decision: createDecisionFormState(
      evolve?.decisionSystem as DecisionTypes,
      evolve?.expirationSeconds as number,
    ),
    rights: createRolesFormState(evolve?.roles as RoleSummaryPartsFragment),
  };
};

export default createEvolveFormState;
