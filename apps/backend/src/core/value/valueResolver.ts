import { ValueType } from "@prisma/client";
import { GraphQLErrorOptions } from "graphql";

import { GraphqlRequestContext } from "@/graphql/context";
import {
  ValueType as GraphQLValueType,
  OptionSelection,
  OptionValue,
  Value,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

import { validateValue } from "./validateValue";
import { OptionValuePrismaType, ValuePrismaType } from "./valuePrismaTypes";
import { entityResolver } from "../entity/entityResolver";
import { flowReferenceResolver } from "../flow/resolvers/flowReferenceResolver";

const errorOptions: GraphQLErrorOptions = {
  extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
};

interface ValueBaseArgs {
  context: GraphqlRequestContext | undefined;
}

interface DefaultValueArgs extends ValueBaseArgs {
  type: "default";
  value: ValuePrismaType;
}

interface OptionValueArgs extends ValueBaseArgs {
  type: "option";
  value: OptionValuePrismaType;
}

type ValueArgs = DefaultValueArgs | OptionValueArgs;

function valueResolver(args: DefaultValueArgs): Value;
function valueResolver(args: OptionValueArgs): OptionValue;

function valueResolver({ type, value, context }: ValueArgs): Value | OptionValue {
  const userIdentityIds = (context?.currentUser?.Identities ?? []).map((id) => id.id);
  const error = `Value error: ${value.type} value is missing for valueId: ${value.id}`;

  switch (value.type) {
    case ValueType.String: {
      if (!value.string) throw new GraphQLError(error, errorOptions);
      return { __typename: "StringValue", value: value.string };
    }
    case ValueType.Uri: {
      if (!value.json) throw new GraphQLError(error, errorOptions);
      const validated = validateValue({ type: ValueType.Uri, value: value.json });
      if (validated.type === GraphQLValueType.Uri) {
        return { __typename: "UriValue", uri: validated.value.uri, name: validated.value.name };
      } else throw new GraphQLError("Invalid URI value returned from database", errorOptions);
    }
    case ValueType.Date: {
      if (!value.date) throw new GraphQLError(error, errorOptions);
      return { __typename: "DateValue", date: value.date.toISOString().split("T")[0] };
    }
    case ValueType.DateTime: {
      if (!value.dateTime) throw new GraphQLError(error, errorOptions);
      return { __typename: "DateTimeValue", dateTime: value.dateTime.toISOString() };
    }
    case ValueType.Float: {
      if (!value.float) throw new GraphQLError(error, errorOptions);
      return { __typename: "FloatValue", float: value.float };
    }
    case ValueType.FlowVersion: {
      const fv = value.FlowVersion;
      if (!fv) throw new GraphQLError(error, errorOptions);

      return {
        __typename: "FlowVersionValue",
        flowVersion: flowReferenceResolver({
          flowId: fv.Flow.id,
          flowVersionId: fv.id,
          flowVersionName: fv.name,
          flowType: fv.Flow.type,
          group: fv.Flow.OwnerGroup,
        }),
      };
    }
    case ValueType.Flows: {
      const vfs = value.ValueFlows;
      if (!vfs) throw new GraphQLError(error, errorOptions);
      return {
        __typename: "FlowsValue",
        flows: vfs.map((vf) => {
          const flowVersion = vf.Flow.CurrentFlowVersion;
          if (!flowVersion)
            throw new GraphQLError("Missing flow version for flow", {
              extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
            });
          return flowReferenceResolver({
            flowId: vf.Flow.id,
            flowVersionId: flowVersion.id,
            group: vf.Flow.OwnerGroup,
            flowVersionName: flowVersion.name,
            flowType: vf.Flow.type,
          });
        }),
      };
    }
    case ValueType.Entities: {
      if (value.ValueEntities.length === 0) throw new GraphQLError(error, errorOptions);
      return {
        __typename: "EntitiesValue",
        entities: value.ValueEntities.map((entity) =>
          entityResolver({ entity: entity.Entity, userIdentityIds }),
        ),
      };
    }
    default: {
      if (type === "default" && value.type === ValueType.OptionSelections) {
        if (value?.ValueOptionSelections?.length === 0) throw new GraphQLError(error, errorOptions);
        return {
          __typename: "OptionSelectionsValue",
          selections: value.ValueOptionSelections.map((os) => {
            const value = valueResolver({ type: "option", value: os.Option.Value, context });
            const optionSelection: OptionSelection = {
              optionId: os.optionId,
              value: value,
              weight: os.weight,
            };
            return optionSelection;
          }),
        };
      } else {
        throw new GraphQLError(
          `Value resolver: Unsupported option type ${value.type} for valueId ${value.id}`,
          {
            extensions: { code: ApolloServerErrorCode.INTERNAL_SERVER_ERROR },
          },
        );
      }
    }
  }
}

export { valueResolver };
