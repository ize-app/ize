import { MutationNewCustomGroupArgs } from "@/graphql/generated/graphql";
import { NewCustomGroupFormFields } from "./newCustomGroupWizard";

export const createNewCustomGroupMutation = (
  formState: NewCustomGroupFormFields,
): MutationNewCustomGroupArgs => {
  return {
    inputs: {
      name: formState.name as string,
      members: formState.members.map((member) => ({
        id: member.id,
        entityType: member.__typename,
      })),
    },
  };
};
