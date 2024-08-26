import { DefaultEvolveGroupValues } from "@/core/flow/resolvers/flowResolver";
import {
  Field,
  FieldDataType,
  FieldOptionsSelectionType,
  FieldType,
  FreeInput,
  Option,
  Options,
  ResultConfig,
  ResultType,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { RequestDefinedOptionSetPrismaType } from "../../request/requestPrismaTypes";
import { FieldSetPrismaType } from "../fieldPrismaTypes";

export const fieldSetResolver = ({
  fieldSet,
  defaultValues,
  requestDefinedOptionSets,
  responseFieldsCache = [],
  resultConfigsCache = [],
}: {
  fieldSet: FieldSetPrismaType | null;
  defaultValues?: DefaultEvolveGroupValues | undefined;
  requestDefinedOptionSets?: RequestDefinedOptionSetPrismaType[];
  responseFieldsCache?: Field[];
  resultConfigsCache?: ResultConfig[];
}): Field[] => {
  if (!fieldSet) return [];
  return fieldSet.FieldSetFields.map((f) => {
    if (f.Field.type === FieldType.FreeInput) {
      const freeInput: FreeInput = {
        __typename: FieldType.FreeInput,
        fieldId: f.Field.id,
        name: f.Field.name,
        required: f.Field.required,
        dataType: f.Field.freeInputDataType as FieldDataType,
        defaultAnswer: defaultValues ? defaultValues[f.Field.name] : undefined,
      };
      return freeInput;
    } else if (f.Field.type === FieldType.Options) {
      if (!f.Field.FieldOptionsConfigs)
        throw new GraphQLError("Missing options config for Options Field.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });

      const config = f.Field.FieldOptionsConfigs;

      // find options defined by request for this field.
      // these options will be combined with flow defined fields
      const requestDefinedOptionSet = requestDefinedOptionSets
        ? requestDefinedOptionSets.find((s) => s.fieldId)
        : undefined;

      const requestOptions = requestDefinedOptionSet
        ? requestDefinedOptionSet.FieldOptionSet.FieldOptionSetFieldOptions.map(
            (o): Option => ({
              optionId: o.FieldOption.id,
              name: o.FieldOption.name,
              dataType: o.FieldOption.dataType as FieldDataType,
            }),
          )
        : [];

      const flowOptions = config.FieldOptionSet.FieldOptionSetFieldOptions.map(
        (o): Option => ({
          optionId: o.FieldOption.id,
          name: o.FieldOption.name,
          dataType: o.FieldOption.dataType as FieldDataType,
        }),
      );

      const linkedResultOptions = config.linkedResultOptions.map((linkedResultConfigId) => {
        const resultConfig = resultConfigsCache.find((r) => {
          return r.resultConfigId === linkedResultConfigId;
        });

        if (!resultConfig)
          throw new GraphQLError(
            `Linked result config not found for fieldId ${f.fieldId} and resultConfigId ${linkedResultConfigId} `,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );

        // TODO: Not sure why the type here can be undefined. Need to investigate
        if (!resultConfig.__typename)
          throw new GraphQLError(`Mmissing __typename for resultConfigId ${linkedResultConfigId}`, {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          });

        const field = responseFieldsCache.find((f) => f.fieldId === resultConfig.fieldId);

        if (!field)
          throw new GraphQLError(
            `Linked result config's field not found for resultConfigId ${linkedResultConfigId} `,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );

        return {
          resultConfigId: linkedResultConfigId,
          resultType: resultConfig.__typename as ResultType,
          fieldId: field.fieldId,
          fieldName: field.name,
        };
      });

      const options: Options = {
        __typename: FieldType.Options,
        fieldId: f.Field.id,
        name: f.Field.name,
        required: f.Field.required,
        requestOptionsDataType: config.requestOptionsDataType as FieldDataType,
        linkedResultOptions,
        previousStepOptions: config.previousStepOptions,
        selectionType: config.selectionType as FieldOptionsSelectionType,
        maxSelections: config.maxSelections,
        options: [...flowOptions, ...requestOptions],
        // defaultAnswer: defaultValues ? defaultValues[f.Field.name] : undefined,
      };
      return options;
    } else
      throw new GraphQLError("Unknown field type.", {
        extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
      });
  });
};
