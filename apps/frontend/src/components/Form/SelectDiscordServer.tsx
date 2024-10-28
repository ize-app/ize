import { useLazyQuery } from "@apollo/client";
import { Box, Typography } from "@mui/material";
import { FieldPath, FieldValues, Path, useFormContext } from "react-hook-form";

import AsyncSelect from "@/components/Form/formFields/AsyncSelect";
import {
  DiscordServer,
  DiscordServerRolesDocument,
  GetDiscordServersDocument,
} from "@/graphql/generated/graphql";

import { SelectOption } from "./formFields/Select";
import discordBotInviteUrl from "../Auth/discordBotInviteUrl";

interface SelectTelegramChatProps<T extends FieldValues> {
  name: FieldPath<T>;
} // whether this query should only return chats where the user is an admin}

export const SelectDisordServer = <T extends FieldValues>({ name }: SelectTelegramChatProps<T>) => {
  const { watch } = useFormContext<T>();
  const [getDiscordServers, { loading: loading, data }] = useLazyQuery(GetDiscordServersDocument, {
    fetchPolicy: "network-only",
  });

  const discordServers = data?.getDiscordServers ?? [];

  const server: DiscordServer | null = watch(`${name}.server` as Path<T>);

  const serverHasCultsBot = server ? server.hasCultsBot : false;

  const defaultServerRoleOptions: SelectOption[] = [{ name: "@everyone", value: "@everyone" }];

  const [getDiscordRoles, { data: roleData, loading: roleLoading }] = useLazyQuery(
    DiscordServerRolesDocument,
    {
      variables: {
        serverId: server?.id ?? "",
      },
    },
  );

  roleData?.discordServerRoles;

  const discordServerRoles = serverHasCultsBot
    ? (roleData?.discordServerRoles ?? [])
        .filter((role) => !role.botRole)
        .map((role) => ({ name: role.name, value: role.id }))
    : defaultServerRoleOptions;

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        alignItems: "center",
      }}
    >
      <AsyncSelect<T, DiscordServer>
        label={"Discord server"}
        name={`${name}.server` as Path<T>}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        loading={loading}
        options={discordServers}
        // sx={{ width: "200px" }}
        fetchOptions={async () => {
          await getDiscordServers();
        }}
      />{" "}
      {server && (
        <>
          <AsyncSelect<T, SelectOption>
            label={"Role"}
            name={`${name}.role` as Path<T>}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.value === value.value}
            loading={roleLoading}
            options={discordServerRoles}
            fetchOptions={async () => {
              await getDiscordRoles();
            }}
          />
        </>
      )}
      {!serverHasCultsBot && server?.id && (
        <Typography>
          To use all roles in this server, ask your admin to{" "}
          <a href={discordBotInviteUrl.toString()} target="_blank" rel="noopener noreferrer">
            add the Ize Discord bot
          </a>{" "}
          to this server.
        </Typography>
      )}
    </Box>
  );
};
