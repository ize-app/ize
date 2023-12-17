import { RequestInputArgs } from "@graphql/generated/resolver-types";
import { InputTemplatSetPrismaType } from "../../utils/formatProcess";

export const validateRequestInputs = (
  requestInputs: RequestInputArgs[],
  processInputTemplates: InputTemplatSetPrismaType,
): boolean => {
  // check that request doesn't have any template Ids that aren't part of the process
  const onlyValidProcessTemplateIds = requestInputs.every((reqInput) => {
    processInputTemplates.inputTemplates.find((processInputTemplate) => {
      if ((reqInput.inputId = processInputTemplate.id)) return true;
    });
  });

  if (!onlyValidProcessTemplateIds) return false;

  // check whether all input template fields in process have corresponding valid field in request
  // TODO: validate whether inputs are correct data type
  const validRequestInputs = processInputTemplates.inputTemplates.every((inputTemplate) => {
    if (!inputTemplate.required) return true;
    const requestInput = requestInputs.find((elem) => {
      return elem.inputId === inputTemplate.id;
    });
    if (!requestInput) return false;
  });

  if (!validRequestInputs) return false;

  return true;
};
