import { FlowType } from "@prisma/client";

import { getIzeGroup } from "@/core/entity/group/getIzeGroup";
import { GraphqlRequestContext } from "@/graphql/context";
import { FieldAnswer, SystemFieldType } from "@/graphql/generated/resolver-types";

import { FlowVersionPrismaType } from "../flowPrismaTypes";

export type DefaultEvolveGroupValues = Partial<Record<SystemFieldType, FieldAnswer>>;

// TODO this is janky as hell
export const getDefaultFlowValues = async ({
  flowVersion,
  context,
}: {
  flowVersion: FlowVersionPrismaType;
  context: GraphqlRequestContext;
}): Promise<DefaultEvolveGroupValues | undefined> => {
  let defaultValues: DefaultEvolveGroupValues | undefined = undefined;

  if (flowVersion.Flow.type === FlowType.EvolveGroup && flowVersion.Flow.OwnerGroup?.id) {
    const group = await getIzeGroup({
      groupId: flowVersion.Flow.OwnerGroup?.id,
      context,
      getWatchAndPermissionStatus: true,
    });
    defaultValues = {
      [SystemFieldType.GroupName]: {
        __typename: "FreeInputFieldAnswer",
        fieldId: "",
        value: group.group.name,
      },
      [SystemFieldType.GroupDescription]: {
        __typename: "FreeInputFieldAnswer",
        fieldId: "",
        value: group.description ?? "",
      },
      [SystemFieldType.GroupMembers]: {
        __typename: "EntitiesFieldAnswer",
        fieldId: "",
        entities: group.members,
      },
    };
  }
  return defaultValues;
};
