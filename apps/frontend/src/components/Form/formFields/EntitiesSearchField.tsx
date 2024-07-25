import { MailOutline } from "@mui/icons-material";
import Autocomplete from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useContext, useState } from "react";
import {
  Controller,
  FieldValues,
  UseControllerProps,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

import { CurrentUserContext } from "@/contexts/current_user_context";
import { RecentAgentsContext } from "@/contexts/RecentAgentContext";
import { dedupEntities } from "@/utils/dedupEntities";

import {
  EntitySummaryPartsFragment,
  EntityType,
  NewEntityTypes,
} from "../../../graphql/generated/graphql";
import { Avatar } from "../../AvatarOld";
import { DiscordLogoSvg, EthLogoSvg } from "../../icons";
import NftSvg from "../../icons/NftSvg";
import { EntityModal } from "../EntityModal/EntityModal";

interface EntitySearchProps<T extends FieldValues> extends UseControllerProps<T> {
  label?: string;
  ariaLabel: string;
  placeholderText?: string;
  hideCustomGroups?: boolean;
  setFieldValue: UseFormSetValue<T>;
  getFieldValues: UseFormGetValues<T>;
}

export const EntitiesSearchField = <T extends FieldValues>({
  control,
  name,
  label,
  ariaLabel,
  hideCustomGroups = false,
  setFieldValue,
  getFieldValues,
  ...props
}: EntitySearchProps<T>) => {
  const { me } = useContext(CurrentUserContext);
  const { recentAgents, setRecentAgents } = useContext(RecentAgentsContext);
  // Filtering discord roles since we don't yet have a good way of searching for other user's discord role
  const userIdentities = me
    ? (me.identities as EntitySummaryPartsFragment[]).filter(
        (id) => !(id.__typename === "Identity" && id.identityType.__typename === "IdentityDiscord"),
      )
    : [];

  const customGroups = hideCustomGroups ? [] : me?.groups ?? [];

  const options = [...userIdentities, ...recentAgents, ...customGroups];

  const [open, setOpen] = useState(false);
  const [roleModalType, setRoleModalType] = useState(NewEntityTypes.IdentityEmail);

  const onSubmit = (value: EntitySummaryPartsFragment[]) => {
    setRecentAgents(value);

    const currentState = (getFieldValues(name) ?? []) as EntitySummaryPartsFragment[];
    const newAgents = dedupEntities([...(currentState ?? []), ...(value ?? [])]);

    //@ts-expect-error TODO
    setFieldValue(name, newAgents);
  };
  return me ? (
    <>
      {open && ( // unmounting the modal fully so that react hook form state clears
        <EntityModal
          open={open}
          setOpen={setOpen}
          onSubmit={onSubmit}
          initialType={roleModalType}
        />
      )}
      <Controller
        name={name}
        control={control}
        render={({ field, fieldState: { error } }) => {
          return (
            <FormControl required>
              <Autocomplete
                includeInputInList={true}
                multiple
                aria-label={ariaLabel}
                id="tags-filled"
                size="small"
                {...field}
                {...props}
                options={options}
                getOptionLabel={(option: EntitySummaryPartsFragment) => option.name}
                onChange={(_event, data) => field.onChange(data)}
                isOptionEqualToValue={(
                  option: EntitySummaryPartsFragment,
                  value: EntitySummaryPartsFragment,
                ) => {
                  return option.id === value.id;
                }}
                PaperComponent={({ children }) => {
                  return (
                    <Paper>
                      <Box
                        sx={{
                          padding: "8px 12px",
                          display: "flex",
                          flexDirection: "row",
                          gap: "8px",
                          flexWrap: "wrap",
                        }}
                      >
                        <Button
                          variant="outlined"
                          startIcon={<MailOutline color="primary" />}
                          onMouseDown={() => {
                            setRoleModalType(NewEntityTypes.IdentityEmail);
                            setOpen(true);
                          }}
                        >
                          Email address
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<EthLogoSvg />}
                          onMouseDown={() => {
                            setRoleModalType(NewEntityTypes.IdentityBlockchain);
                            setOpen(true);
                          }}
                        >
                          Eth Wallet
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<DiscordLogoSvg />}
                          onMouseDown={() => {
                            setRoleModalType(NewEntityTypes.GroupDiscord);
                            setOpen(true);
                          }}
                        >
                          Discord @role
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<NftSvg />}
                          onMouseDown={() => {
                            setRoleModalType(NewEntityTypes.GroupNft);
                            setOpen(true);
                          }}
                        >
                          NFT
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<NftSvg />}
                          onMouseDown={() => {
                            setRoleModalType(NewEntityTypes.GroupHat);
                            setOpen(true);
                          }}
                        >
                          Hat
                        </Button>
                      </Box>
                      {children}
                    </Paper>
                  );
                }}
                renderTags={(value: readonly EntitySummaryPartsFragment[], getTagProps) =>
                  value.map((option: EntitySummaryPartsFragment, index: number) => {
                    return (
                      <Chip
                        avatar={
                          <Avatar
                            id={option.id}
                            backgroundColor={
                              option.__typename === "Group" ? option.color : undefined
                            }
                            name={option.name}
                            avatarUrl={
                              option.__typename === "Group" && option.organization
                                ? option.organization.icon ?? option.icon
                                : option.icon
                            }
                            type={option.__typename as EntityType}
                            cryptoWallet={
                              option.__typename === "Identity" &&
                              option.identityType.__typename === "IdentityBlockchain"
                                ? option.identityType.address
                                : null
                            }
                          />
                        }
                        variant="filled"
                        label={option.name}
                        color="primary"
                        {...getTagProps({ index })}
                        key={option.id}
                      />
                    );
                  })
                }
                renderOption={(props, option) => (
                  <Box
                    {...props}
                    component="li"
                    sx={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "left",
                      alignItems: "center",
                      gap: "16px",
                      verticalAlign: "middle",
                    }}
                    key={"option" + option.id}
                  >
                    <Avatar
                      id={option.id}
                      key={"avatar" + option.id}
                      avatarUrl={
                        option.__typename === "Group" && option.organization
                          ? option.organization.icon ?? option.icon
                          : option.icon
                      }
                      name={option.name}
                      backgroundColor={option.__typename === "Group" ? option.color : undefined}
                      type={option.__typename as EntityType}
                      cryptoWallet={
                        option.__typename === "Identity" &&
                        option.identityType.__typename === "IdentityBlockchain"
                          ? option.identityType.address
                          : null
                      }
                    />
                    <Typography
                      variant="body1"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {option.name}
                    </Typography>
                  </Box>
                )}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={label}
                    placeholder="Add a group or identity..."
                    InputProps={{
                      ...params.InputProps,
                      type: "search",
                    }}
                    variant="outlined"
                    error={Boolean(error)}
                  />
                )}
              />
              <FormHelperText
                sx={{
                  color: "error.main",
                }}
              >
                {error?.message ?? ""}
              </FormHelperText>
            </FormControl>
          );
        }}
      />
    </>
  ) : null;
};
