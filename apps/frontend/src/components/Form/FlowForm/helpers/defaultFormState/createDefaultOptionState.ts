import { FieldDataType } from "@/graphql/generated/graphql";

import { FieldOptionSchemaType } from "../../formValidation/fields";

export const createDefaultOptionState = (): FieldOptionSchemaType => ({
  optionId: crypto.randomUUID(),
  name: "",
  dataType: FieldDataType.String,
});
