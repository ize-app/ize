import { MutationNewCustomGroupArgs } from "@/graphql/generated/graphql";

import { GroupInitialSetupSchemaType } from "./formValidation";

export const createNewCustomGroupMutation = (
  formState: GroupInitialSetupSchemaType,
): MutationNewCustomGroupArgs => {
  return {
    inputs: {
      name: formState.name,
      description: formState.description,
      members: formState.members.map((member) => ({
        id: member.entityId,
      })),
      notificationUri: formState.notification.uri,
    },
  };
};
