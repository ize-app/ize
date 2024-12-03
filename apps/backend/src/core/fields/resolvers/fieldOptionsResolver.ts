import { GraphqlRequestContext } from "@/graphql/context";
import { Option } from "@/graphql/generated/resolver-types";

import { RequestDefinedOptionSetPrismaType } from "../../request/requestPrismaTypes";
import { constructOrderedOptions } from "../constructOrderedOptions";
import { FieldOptionsConfigPrismaType } from "../fieldPrismaTypes";
import { fieldOptionResolver } from "./fieldOptionResolver";

export const fieldOptionsResolver = ({
  optionsConfig,
  requestDefinedOptionSets,
  context,
}: {
  optionsConfig: FieldOptionsConfigPrismaType;
  requestDefinedOptionSets: RequestDefinedOptionSetPrismaType[] | undefined;
  context: GraphqlRequestContext;
}): Option[] => {
  const options = constructOrderedOptions({ optionsConfig, requestDefinedOptionSets });

  return options.map((option) => fieldOptionResolver({ option, context }));
};
