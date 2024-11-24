import { DefaultEvolveGroupValues } from "@/core/flow/helpers/getDefaultFlowValues";
import {
  Field,
  FieldDataType,
  FieldSet,
  FieldType,
  FreeInput,
  LinkedResult,
  Option,
  OptionSelectionType,
  Options,
  ResultConfig,
  SystemFieldType,
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
}): FieldSet => {
  // if (!fieldSet) return [];
  const fields: Field[] = (fieldSet?.Fields ?? []).map((field) => {
    if (field.type === FieldType.FreeInput) {
      const freeInput: FreeInput = {
        __typename: FieldType.FreeInput,
        isInternal: field.isInternal,
        fieldId: field.id,
        name: field.name,
        systemType: field.systemType as SystemFieldType,
        required: field.required,
        dataType: field.freeInputDataType as FieldDataType,
        defaultAnswer:
          defaultValues && field.systemType ? defaultValues[field.systemType] : undefined,
      };
      return freeInput;
    } else if ((field.type as FieldType) === FieldType.Options) {
      if (!field.FieldOptionsConfig)
        throw new GraphQLError("Missing options config for Options Field.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });

      const config = field.FieldOptionsConfig;

      // find options defined by request for this field.
      // these options will be combined with flow defined fields
      const requestDefinedOptionSet = requestDefinedOptionSets
        ? requestDefinedOptionSets.find((s) => s.fieldId === field.id)
        : undefined;

      const requestOptions = requestDefinedOptionSet
        ? requestDefinedOptionSet.FieldOptionSet.FieldOptions.map(
            (option): Option => ({
              optionId: option.id,
              name: option.name,
              dataType: option.dataType as FieldDataType,
            }),
          )
        : [];

      const flowOptions = (config.PredefinedOptionSet?.FieldOptions ?? []).map(
        (option): Option => ({
          optionId: option.id,
          name: option.name,
          dataType: option.dataType as FieldDataType,
        }),
      );

      const linkedResultOptions = config.linkedResultOptions.map((linkedResultConfigId) => {
        const resultConfig = resultConfigsCache.find((r) => {
          return r.resultConfigId === linkedResultConfigId;
        });

        if (!resultConfig)
          throw new GraphQLError(
            `Linked result config not found for resultConfigId ${linkedResultConfigId} `,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );

        const field = responseFieldsCache.find((f) => f.fieldId === resultConfig.field.fieldId);

        if (!field)
          throw new GraphQLError(
            `Linked result config's field not found for resultConfigId ${linkedResultConfigId} `,
            {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            },
          );

        return {
          resultConfigId: linkedResultConfigId,
          resultName: resultConfig.name,
          fieldId: field.fieldId,
          fieldName: field.name,
        } as LinkedResult;
      });

      const options: Options = {
        __typename: FieldType.Options,
        fieldId: field.id,
        isInternal: field.isInternal,
        name: field.name,
        required: field.required,
        systemType: field.systemType as SystemFieldType,
        requestOptionsDataType: config.requestOptionsDataType as FieldDataType,
        linkedResultOptions,
        previousStepOptions: config.previousStepOptions,
        selectionType: config.selectionType as OptionSelectionType,
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

  return { fields, locked: fieldSet?.locked ?? false };
};
