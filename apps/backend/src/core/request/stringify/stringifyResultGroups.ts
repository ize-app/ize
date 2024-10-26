import { stringifyGenericFieldValues } from "./stringifyGenericFieldValues";
import { RequestResultGroup } from "../createRequestPayload/getRequestResults";

export const stringifyResultGroups = ({
  results,
  type,
}: {
  results: RequestResultGroup[];
  type: "html" | "markdown";
}) => {
  return results
    .map((resultGroup) => {
      return `Result for ${resultGroup.fieldName}:\n\n${stringifyGenericFieldValues({ values: resultGroup.result, type })}`;
    })
    .join(`\n\n`);
};
