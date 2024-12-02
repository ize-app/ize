import { DefaultEvolveGroupValues } from "@/core/flow/helpers/getDefaultFlowValues";
import { GraphqlRequestContext } from "@/graphql/context";
import {
  Field,
  FieldSet,
  LinkedResult,
  OptionSelectionType,
  OptionsConfig,
  ResultConfig,
  SystemFieldType,
  ValueType,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { RequestDefinedOptionSetPrismaType } from "../../request/requestPrismaTypes";
import { constructFieldOptions } from "../constructFieldOptions";
import { FieldSetPrismaType } from "../fieldPrismaTypes";

export const fieldSetResolver = ({
  fieldSet,
  defaultValues,
  requestDefinedOptionSets,
  responseFieldsCache = [],
  resultConfigsCache = [],
  context,
}: {
  fieldSet: FieldSetPrismaType | null;
  defaultValues?: DefaultEvolveGroupValues | undefined;
  requestDefinedOptionSets?: RequestDefinedOptionSetPrismaType[];
  responseFieldsCache?: Field[];
  resultConfigsCache?: ResultConfig[];
  context: GraphqlRequestContext;
}): FieldSet => {
  if (!fieldSet) return { fields: [], locked: false };
  let optionsConfig: OptionsConfig | undefined = undefined;
  const fields: Field[] = (fieldSet?.Fields ?? []).map((field): Field => {
    const { type, FieldOptionsConfig, id: fieldId, isInternal, name, systemType, required } = field;
    if (type === ValueType.OptionSelections) {
      if (!FieldOptionsConfig)
        throw new GraphQLError("Missing options config for Options Field.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      const config = FieldOptionsConfig;

      const allOptions = constructFieldOptions({
        optionsConfig: config,
        requestDefinedOptionSets,
        context,
      });

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
      optionsConfig = {
        triggerOptionsType: (config.triggerOptionsType as ValueType) ?? undefined,
        linkedResultOptions,
        selectionType: config.selectionType as OptionSelectionType,
        maxSelections: config.maxSelections,
        options: allOptions,
      };
    }

    return {
      type,
      isInternal,
      fieldId,
      name: name,
      systemType: systemType as SystemFieldType,
      required: required,
      optionsConfig,
      defaultAnswer: defaultValues && systemType ? defaultValues[systemType] : undefined,
    } as Field;
  });

  return { fields, locked: fieldSet?.locked ?? false };
};
