import { GroupFlowPolicyType } from "@/graphql/generated/graphql";
import { WizardSteps, useWizardFormState } from "@/hooks/useWizard";

import { GroupSetupAndPoliciesSchemaType } from "./formValidation";
import { NewCustomGroupRoute, newCustomGroupRoute } from "../../routers/routes";

export const newCustomGroupFormFieldsDefault: GroupSetupAndPoliciesSchemaType = {
  members: [],
  name: "",
  notification: {},
  flows: {
    evolveGroup: {
      type: GroupFlowPolicyType.GroupDecision,
    },
    watch: {
      type: GroupFlowPolicyType.GroupAutoApprove,
    },
  },
};

export function useNewCustomGroupWizardState() {
  return useWizardFormState<GroupSetupAndPoliciesSchemaType>();
}

export const NEW_CUSTOM_GROUP_PROGRESS_BAR_STEPS = ["Setup", "Policy"];

export const NEW_CUSTOM_GROUP_WIZARD_STEPS: WizardSteps<GroupSetupAndPoliciesSchemaType> = [
  {
    path: newCustomGroupRoute(NewCustomGroupRoute.Setup),
    title: "Setup group",
    progressBarStep: 0,
    canNext: () => true,
    validWizardState: () => true,
  },
  {
    path: newCustomGroupRoute(NewCustomGroupRoute.Policy),
    title: "How can this group evolve over time?",
    progressBarStep: 1,
    canNext: () => true,
    validWizardState: (formState: GroupSetupAndPoliciesSchemaType) => !!formState.name,
  },
];
