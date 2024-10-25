import {
  ActionType,
  FlowType,
  NewFlowArgs,
  SystemFieldType,
} from "@/graphql/generated/resolver-types";
import { ApolloServerErrorCode, GraphQLError } from "@graphql/errors";

export const validateFlowTypeArgs = ({ args }: { args: NewFlowArgs }) => {
  const type = args.type;
  let requiredFields: SystemFieldType[] = [];
  let requiredFinalAction: ActionType | null = null;
  const restrictedActionTypes = [
    ActionType.EvolveFlow,
    ActionType.EvolveGroup,
    ActionType.GroupWatchFlow,
  ];

  switch (type) {
    case FlowType.Evolve:
      requiredFields = [
        SystemFieldType.EvolveFlowCurrent,
        SystemFieldType.EvolveFlowProposed,
        SystemFieldType.EvolveFlowDescription,
      ];
      requiredFinalAction = ActionType.EvolveFlow;
      break;
    case FlowType.EvolveGroup:
      requiredFields = [
        SystemFieldType.GroupName,
        SystemFieldType.GroupDescription,
        SystemFieldType.GroupMembers,
      ];
      requiredFinalAction = ActionType.EvolveGroup;
      break;
    case FlowType.GroupWatchFlow:
      requiredFields = [SystemFieldType.WatchFlow, SystemFieldType.UnwatchFlow];
      requiredFinalAction = ActionType.GroupWatchFlow;
      break;
    case FlowType.Custom:
      if (args.fieldSet.fields.some((f) => !!f.systemType))
        throw new GraphQLError(`Custom flow uses restricted system field type`, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      if (args.steps[0].action && restrictedActionTypes.includes(args.steps[0].action.type))
        throw new GraphQLError(`Custom flow uses restricted system field type`, {
          extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
        });
      break;
  }

  requiredFields.forEach((systemField) => {
    if (!args.fieldSet.fields.some((field) => field.systemType === systemField)) {
      throw new GraphQLError(`${type} flow missing required fields`, {
        extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
      });
    }
  });

  if (requiredFinalAction && args.steps[args.steps.length - 1].action?.type !== requiredFinalAction)
    throw new GraphQLError(`${type} has incorrect action type`, {
      extensions: { code: ApolloServerErrorCode.BAD_USER_INPUT },
    });
};
