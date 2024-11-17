import { createFreeInputDefaultValue } from "@/components/Form/utils/createFreeInputDefaultState";
import { FieldDataType } from "@/graphql/generated/graphql";

import { FieldOptionSchemaType } from "../../formValidation/fields";

export const createDefaultOptionState = ({
  dataType,
}: {
  dataType: FieldDataType;
}): FieldOptionSchemaType => ({
  optionId: crypto.randomUUID(),
  name: createFreeInputDefaultValue({ dataType }),
  dataType: dataType,
});
