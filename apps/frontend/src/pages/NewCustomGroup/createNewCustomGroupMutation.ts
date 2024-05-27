import { MutationNewCustomGroupArgs } from "@/graphql/generated/graphql";

import { NewCustomGroupFormFields } from "./newCustomGroupWizard";

export const createNewCustomGroupMutation = (
  formState: NewCustomGroupFormFields,
): MutationNewCustomGroupArgs => {
  return {
    inputs: {
      name: formState.name,
      members: formState.members.map((member) => ({
        id: member.id,
        entityType: member.__typename,
      })),
    },
  };
};
