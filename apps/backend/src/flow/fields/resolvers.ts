import {
  Field,
  FieldType,
  FreeInput,
  Options,
  FieldDataType,
  FieldOptionsSelectionType,
} from "@/graphql/generated/resolver-types";
import { GraphQLError, ApolloServerErrorCode } from "@graphql/errors";
import { FieldSetPrismaType } from "./types";

export const fieldSetResolver = (fieldSet: FieldSetPrismaType): Field[] => {
  return fieldSet.FieldSetFields.map((f) => {
    if (f.Field.type === FieldType.FreeInput) {
      const freeInput: FreeInput = {
        __typename: FieldType.FreeInput,
        fieldId: f.Field.id,
        name: f.Field.name,
        required: f.Field.required,
        dataType: f.Field.freeInputDataType as FieldDataType,
      };
      return freeInput;
    } else if (f.Field.type === FieldType.Options) {=
      if (!f.Field.FieldOptionsConfigs)
        throw new GraphQLError("Missing options config for Options Field.", {
          extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
        });
      const config = f.Field.FieldOptionsConfigs;
      const options: Options = {
        __typename: FieldType.Options,
        fieldId: f.Field.id,
        name: f.Field.name,
        required: f.Field.required,
        hasRequestOptions: config.hasRequestOptions,
        requestOptionsDataType: config.requestOptionsDataType as FieldDataType,
        previousStepOptions: config.previousStepOptions,
        selectionType: config.selectionType as FieldOptionsSelectionType,
        maxSelections: config.maxSelections,
        options: config.FieldOptionSet.FieldOptionSetFieldOptions.map((o) => ({
          optionId: o.FieldOption.id,
          name: o.FieldOption.name,
          dataType: o.FieldOption.dataType as FieldDataType,
        })),
      };
      return options;
    } else throw Error("");
  });
};
