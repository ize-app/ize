import { useLazyQuery } from "@apollo/client";
import { FieldPath, FieldValues, UseControllerProps } from "react-hook-form";

import AsyncSelect from "@/components/Form/formFields/AsyncSelect";
import { EntityFragment, TelegramChatsDocument } from "@/graphql/generated/graphql";

interface SelectTelegramChatProps<T extends FieldValues> extends UseControllerProps<T> {
  label: string;
  showLabel?: boolean;
  name: FieldPath<T>;
}

export const SelectTelegramChat = <T extends FieldValues>({
  label,
  name,
}: SelectTelegramChatProps<T>) => {
  const [getTelegramChats, { loading: telegramChatsLoading, data: telegramChats }] =
    useLazyQuery(TelegramChatsDocument);

  return (
    <AsyncSelect<T, EntityFragment>
      label={label}
      name={name}
      getOptionLabel={(option) => option.name}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      loading={telegramChatsLoading}
      options={telegramChats?.telegramChats || []}
      fetchOptions={async () => {
        await getTelegramChats();
      }}
    />
  );
};
