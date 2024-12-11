import { SelectOption } from "../formFields/Select";

export const getSelectOptionName = (selectOptions: SelectOption[], id: string) => {
  const option = (selectOptions ?? []).find((o) => o.value === id);
  if (!option) return null;
  return option.name ?? "";
};
