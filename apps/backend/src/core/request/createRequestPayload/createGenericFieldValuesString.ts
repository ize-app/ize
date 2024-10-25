import { GenericFieldAndValue } from "@/graphql/generated/resolver-types";

export const createGenericFieldValuesString = (values: GenericFieldAndValue[]) => {
  return values
    .map((val) => {
      if (val.value.length === 0) {
        return `<strong>${val.fieldName}</strong>: -`;
      } else if (val.value.length === 1) {
        return `<strong>${val.fieldName}</strong>:\n${val.value[0]}`;
      } else {
        return `<strong>${val.fieldName}</strong>:\n- ${val.value.map((v) => `- ${v}`).join(`\n`)}`;
      }
    })
    .join(`\n`);
};
