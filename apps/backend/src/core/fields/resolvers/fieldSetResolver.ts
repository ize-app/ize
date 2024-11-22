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
  const fields: Field[] = (fieldSet?.FieldSetFields ?? []).map((f) => {
    if (f.Field.type === FieldType.FreeInput) {
      const freeInput: FreeInput = {
        __typename: FieldType.FreeInput,
        isInternal: f.Field.isInternal,
        fieldId: f.Field.id,
        name: f.Field.name,
        systemType: f.Field.systemType as SystemFieldType,
        required: f.Field.required,
        dataType: f.Field.freeInputDataType as FieldDataType,
        defaultAnswer:
          defaultValues && f.Field.systemType ? defaultValues[f.Field.systemType] : undefined,
      };
      return freeInput;
    } else if ((f.Field.type as FieldType) === FieldType.Options) {
      if (!f.Field.FieldOptionsConfigs)
        throw new GraphQLError("Missing options config for Options Field.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });

      const config = f.Field.FieldOptionsConfigs;

      // find options defined by request for this field.
      // these options will be combined with flow defined fields
      const requestDefinedOptionSet = requestDefinedOptionSets
        ? requestDefinedOptionSets.find((s) => s.fieldId === f.fieldId)
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
        fieldId: f.Field.id,
        isInternal: f.Field.isInternal,
        name: f.Field.name,
        required: f.Field.required,
        systemType: f.Field.systemType as SystemFieldType,
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
