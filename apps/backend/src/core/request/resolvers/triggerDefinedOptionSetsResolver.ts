import { fieldOptionSetResolver } from "@/core/fields/resolvers/fieldOptionSetResolver";
import { Flow, TriggerDefinedOptions } from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { RequestDefinedOptionSetPrismaType } from "../requestPrismaTypes";

export const triggerDefinedOptionSetsResolver = ({
  triggerDefinedOptionSets,
  flow,
}: {
  triggerDefinedOptionSets: RequestDefinedOptionSetPrismaType[];
  flow: Flow;
}): TriggerDefinedOptions[] => {
  return triggerDefinedOptionSets
    .map((options) => {
      let fieldName: string | null = null;
      if (!options.isTriggerDefined) return null;
      for (const step of flow.steps) {
        const field = step.fieldSet.fields.find((field) => {
          return field.fieldId === options.fieldId;
        });
        if (!field) continue;
        else {
          fieldName = field.name;
          break;
        }
      }

      if (!fieldName)
        throw new GraphQLError("Cannot find corresponding field for trigger defined options.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });

      return {
        fieldId: options.fieldId,
        fieldName,
        options: fieldOptionSetResolver({ fieldOptionSet: options.FieldOptionSet }),
      };
    })
    .filter((options) => options !== null);
};
