import { FlowType } from "@prisma/client";

import { getIzeGroup } from "@/core/entity/group/getIzeGroup";
import { GraphqlRequestContext } from "@/graphql/context";

import { FlowVersionPrismaType } from "../flowPrismaTypes";
import { EvolveGroupFields } from "../flowTypes/evolveGroup/EvolveGroupFields";
import { DefaultEvolveGroupValues } from "../resolvers/flowResolver";

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
      [EvolveGroupFields.Name]: {
        __typename: "FreeInputFieldAnswer",
        fieldId: "",
        value: group.group.name,
      },
      [EvolveGroupFields.Description]: {
        __typename: "FreeInputFieldAnswer",
        fieldId: "",
        value: group.description ?? "",
      },
      [EvolveGroupFields.Members]: {
        __typename: "EntitiesFieldAnswer",
        fieldId: "",
        entities: group.members,
      },
    };
  }
  return defaultValues;
};
