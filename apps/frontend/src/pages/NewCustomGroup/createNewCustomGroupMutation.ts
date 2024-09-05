import { MutationNewCustomGroupArgs } from "@/graphql/generated/graphql";

import { GroupSetupAndPoliciesSchemaType } from "./formValidation";

export const createNewCustomGroupMutation = (
  formState: GroupSetupAndPoliciesSchemaType,
): MutationNewCustomGroupArgs => {
  const args = {
    inputs: {
      name: formState.name,
      description: formState.description,
      members: formState.members.map((member) => ({
        id: member.entityId,
      })),
      notificationUri: formState.notification.uri,
      flows: { ...formState.flows },
    },
  };

  return args;
};
