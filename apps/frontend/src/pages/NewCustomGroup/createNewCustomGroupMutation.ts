import { createEntityArgs } from "@/components/Form/utils/createEntityArgs";
import { Entity, MutationNewCustomGroupArgs } from "@/graphql/generated/graphql";

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
      notificationEntity: formState.notificationEntity
        ? createEntityArgs(formState.notificationEntity as Entity)
        : undefined,
      flows: { ...formState.flows },
    },
  };

  return args;
};
