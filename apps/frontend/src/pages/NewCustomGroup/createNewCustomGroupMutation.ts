import { MutationNewCustomGroupArgs } from "@/graphql/generated/graphql";

import { NewCustomGroupSchemaType } from "./formValidation";

export const createNewCustomGroupMutation = (
  formState: NewCustomGroupSchemaType,
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
