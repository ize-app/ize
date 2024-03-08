import { SelectOption } from "./SelectControl";

export const getSelectOptionName = (selectOptions: SelectOption[], id: string) => {
  const option = (selectOptions ?? []).find((o) => o.value === id);
  if (!option) return null;
  return option.name;
};
