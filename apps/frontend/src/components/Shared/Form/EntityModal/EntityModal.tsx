import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import {
  EntitySummaryPartsFragment,
  NewEntitiesDocument,
  MutationNewEntitiesArgs,
  NewEntityTypes,
  DiscordServerRolesDocument,
  Me,
  Blockchain,
} from "@/graphql/generated/graphql";
import { Button, FormControlLabel, Switch, Typography } from "@mui/material";
import { useMutation, useQuery } from "@apollo/client";
import { zodResolver } from "@hookform/resolvers/zod";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import TextField from "@mui/material/TextField";
import { newEntityFormSchema } from "../formValidation/entity";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useContext, useState } from "react";
import { CurrentUserContext } from "@/contexts/current_user_context";
import { attachDiscord } from "@/components/shared/Auth/attachDiscord";
import { DiscordLogoSvg } from "@/components/shared/icons";
import botInviteUrl from "@/components/shared/Auth/botInviteUrl";
import { HatsTokenCard, NftCard } from "./NftCard";
import { Select, SelectOption } from "../formFields/Select";

type FormFields = z.infer<typeof newEntityFormSchema>;

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "600px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

interface EntityModalProps {
  open: boolean;
  setOpen: (x: boolean) => void;
  onSubmit: (value: EntitySummaryPartsFragment[]) => void;
  initialType: NewEntityTypes;
}

const chainOptions: SelectOption[] = [
  { name: "Ethereum", value: Blockchain.Ethereum },
  { name: "Optimism", value: Blockchain.Optimism },
  { name: "Arbitrum", value: Blockchain.Arbitrum },
  { name: "Matic", value: Blockchain.Matic },
  { name: "Base", value: Blockchain.Base },
];

const createNewAgentArgs = (data: FormFields): MutationNewEntitiesArgs => {
  switch (data.type) {
    case NewEntityTypes.IdentityBlockchain: {
      return {
        entities: (data.ethAddress ?? []).map((address) => ({
          identityBlockchain: {
            address: address,
          },
        })),
      };
    }
    case NewEntityTypes.IdentityEmail: {
      return {
        entities: (data.emailAddress ?? []).map((email) => ({
          identityEmail: {
            email: email,
          },
        })),
      };
    }
    case NewEntityTypes.GroupDiscord: {
      return {
        entities: data.discordRole
          ? [
              {
                groupDiscordRole: {
                  serverId: data.discordRole?.serverId,
                  roleId: data.discordRole?.roleId,
                },
              },
            ]
          : [],
      };
    }
    case NewEntityTypes.GroupNft: {
      return {
        entities: data.nft
          ? [
              {
                groupNft: {
                  chain: data.nft.chain as Blockchain,
                  address: data.nft.contractAddress as string,
                  tokenId: data.nft.tokenId,
                },
              },
            ]
          : [],
      };
    }
    case NewEntityTypes.GroupHat: {
      return {
        entities: data.hat
          ? [
              {
                groupHat: {
                  chain: data.hat.chain as Blockchain,
                  tokenId: data.hat.tokenId,
                },
              },
            ]
          : [],
      };
    }
    default:
      return { entities: [] };
  }
};

export function EntityModal({ open, setOpen, onSubmit, initialType }: EntityModalProps) {
  const { me } = useContext(CurrentUserContext);

  const isConnectedToDiscord = me?.identities.find(
    (id) => id.identityType.__typename === "IdentityDiscord",
  );

  const serverOptions: SelectOption[] = (me as Me).discordServers.map((server) => ({
    name: server.name,
    value: server.id,
  }));

  const [disableSubmit, setDisableSubmit] = useState(false);

  const [mutate] = useMutation(NewEntitiesDocument, {
    onCompleted: (data) => {
      setDisableSubmit(false);
      setOpen(false);
      onSubmit(data.newEntities);
    },
    onError: (error) => {
      console.log("Error", error);
      setDisableSubmit(false);
      setOpen(false);
    },
  });

  const handleClose = () => {
    setOpen(false);
  };

  const { control, handleSubmit, watch } = useForm<FormFields>({
    defaultValues: {
      type: initialType,
      ethAddress: [],
      emailAddress: [],
      nft: {
        chain: Blockchain.Ethereum,
        contractAddress: "",
        tokenId: "",
        allTokens: true,
      },
      hat: {
        chain: Blockchain.Optimism,
        tokenId: "",
      },
      discordRole: {
        serverId: "",
        roleId: "",
      },
    },
    resolver: zodResolver(newEntityFormSchema),
    shouldUnregister: true,
  });

  const createAgents = async (data: FormFields) => {
    setDisableSubmit(true);

    await mutate({
      variables: {
        entities: createNewAgentArgs(data).entities,
      },
    });
  };

  const inputType = watch("type");
  const discordServerId = watch("discordRole.serverId");
  const nftChain = watch("nft.chain");
  const nftContractAddress = watch("nft.contractAddress");
  const nftTokenId = watch("nft.tokenId");
  const nftAllTokens = watch("nft.allTokens");
  const hatTokenId = watch("hat.tokenId");
  const hatChain = watch("hat.chain");

  const serverHasCultsBot = ((me as Me).discordServers ?? []).some(
    (server) => server.id === discordServerId && server.hasCultsBot,
  );

  const defaultServerRoleOptions: SelectOption[] = [{ name: "@everyone", value: "@everyone" }];

  const { data: roleData, loading: roleLoading } = useQuery(DiscordServerRolesDocument, {
    variables: {
      serverId: discordServerId,
    },
    skip: !discordServerId || !serverHasCultsBot,
  });

  const discordServerRoles = serverHasCultsBot
    ? (roleData?.discordServerRoles ?? [])
        .filter((role) => !role.botRole)
        .map((role) => ({ name: role.name, value: role.id }))
    : defaultServerRoleOptions;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="role-selection-modal"
      aria-describedby="role-selection-modal"
    >
      <Box sx={style}>
        <Typography variant="h2" sx={{ mb: "16px" }}>
          Add role
        </Typography>
        <form style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <Select<FormFields>
            name="type"
            width="200px"
            control={control}
            label=""
            selectOptions={[
              { name: "Email address", value: NewEntityTypes.IdentityEmail },
              { name: "Eth wallet", value: NewEntityTypes.IdentityBlockchain },
              { name: "Discord role", value: NewEntityTypes.GroupDiscord },
              { name: "NFT", value: NewEntityTypes.GroupNft },
              { name: "Hat", value: NewEntityTypes.GroupHat },
            ]}
          />
          {inputType === NewEntityTypes.IdentityBlockchain && (
            <Box>
              <Typography>
                Enter an Eth address or ENS address (or multiple seperated by commas).
              </Typography>
              <Box
                sx={{
                  marginTop: "8px",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <Controller
                  name={"ethAddress"}
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          {...field}
                          label={"ETH wallet or ENS"}
                          fullWidth
                          required
                          error={Boolean(error)}
                          placeholder=""
                        />
                        <FormHelperText
                          sx={{
                            color: error?.message ? "error.main" : "black",
                          }}
                        >
                          {error?.message ?? ""}
                        </FormHelperText>
                      </FormControl>
                    );
                  }}
                />
                <Button
                  onClick={handleSubmit(createAgents)}
                  variant="contained"
                  disabled={disableSubmit}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          )}
          {inputType === NewEntityTypes.IdentityEmail && (
            <>
              <Typography>
                Enter an email address (or multiple seperated by commas). The full email address
                will not be publicly visible.
              </Typography>

              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: "24px",
                }}
              >
                <Controller
                  name={"emailAddress"}
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          {...field}
                          label={"Email addresses"}
                          fullWidth
                          required
                          error={Boolean(error)}
                        />
                        <FormHelperText
                          sx={{
                            color: error?.message ? "error.main" : "black",
                          }}
                        >
                          {error?.message ?? ""}
                        </FormHelperText>
                      </FormControl>
                    );
                  }}
                />
                <Button
                  type="submit"
                  onClick={handleSubmit(createAgents)}
                  variant="contained"
                  disabled={disableSubmit}
                >
                  Submit
                </Button>
              </Box>
            </>
          )}
          {inputType === NewEntityTypes.GroupDiscord && (
            <>
              {!isConnectedToDiscord ? (
                <>
                  <Typography>
                    Connect Discord to Ize to attach Discord roles to this process.
                  </Typography>
                  <Button
                    onClick={attachDiscord}
                    variant={"outlined"}
                    sx={{ width: "200px" }}
                    startIcon={<DiscordLogoSvg />}
                  >
                    Connect Discord
                  </Button>
                </>
              ) : (
                <>
                  <Box
                    sx={{
                      width: "100%",
                      display: "flex",
                      flexDirection: "row",
                      gap: "16px",
                      alignItems: "center",
                    }}
                  >
                    <Box sx={{ width: "300px" }}>
                      <Select<FormFields>
                        name="discordRole.serverId"
                        width="200px"
                        control={control}
                        label="Server"
                        selectOptions={serverOptions}
                      />
                    </Box>
                    {discordServerId && (
                      <>
                        <Select<FormFields>
                          name="discordRole.roleId"
                          control={control}
                          label="Role"
                          width="200px"
                          loading={roleLoading}
                          selectOptions={discordServerRoles}
                        />
                        <Button
                          type="submit"
                          onClick={handleSubmit(createAgents)}
                          variant="contained"
                          disabled={disableSubmit}
                        >
                          Submit
                        </Button>
                      </>
                    )}
                  </Box>
                  {!serverHasCultsBot && discordServerId && (
                    <Typography>
                      To use all roles in this server, ask your admin to{" "}
                      <a href={botInviteUrl.toString()} target="_blank" rel="noopener noreferrer">
                        add the Ize Discord bot
                      </a>{" "}
                      to this server.
                    </Typography>
                  )}
                </>
              )}
            </>
          )}
          {inputType === NewEntityTypes.GroupNft && (
            <>
              <div>
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                    alignItems: "left",
                  }}
                >
                  <Box sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
                    <Select<FormFields>
                      name="nft.chain"
                      control={control}
                      width="140px"
                      label="Chain"
                      selectOptions={chainOptions}
                    />
                    <Controller
                      name={"nft.contractAddress"}
                      control={control}
                      render={({ field, fieldState: { error } }) => {
                        return (
                          <FormControl sx={{ width: "100%" }}>
                            <TextField
                              {...field}
                              label={"Contract Address"}
                              fullWidth
                              required
                              error={Boolean(error)}
                              placeholder="Address of this NFT contract"
                            />
                            <FormHelperText
                              sx={{
                                color: error?.message ? "error.main" : "black",
                              }}
                            >
                              {error?.message ?? ""}
                            </FormHelperText>
                          </FormControl>
                        );
                      }}
                    />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <Controller
                      name={"nft.allTokens"}
                      control={control}
                      render={({ field }) => {
                        return (
                          <FormControl>
                            <FormControlLabel
                              label="Include all token Ids"
                              control={<Switch {...field} checked={field.value} />}
                            />
                          </FormControl>
                        );
                      }}
                    />
                    {!nftAllTokens && (
                      <Controller
                        name={"nft.tokenId"}
                        control={control}
                        render={({ field, fieldState: { error } }) => {
                          console.log("error is ", error);
                          return (
                            <FormControl sx={{ width: "300px" }}>
                              <TextField
                                {...field}
                                label={"Token Id"}
                                fullWidth
                                // required
                                error={Boolean(error)}
                                placeholder="Token Id"
                              />
                              <FormHelperText
                                sx={{
                                  color: error?.message ? "error.main" : "black",
                                }}
                              >
                                {error?.message ?? ""}
                              </FormHelperText>
                            </FormControl>
                          );
                        }}
                      />
                    )}
                  </Box>
                  <NftCard address={nftContractAddress} tokenId={nftTokenId} chain={nftChain} />
                  <Button
                    onClick={handleSubmit(createAgents)}
                    variant="contained"
                    disabled={disableSubmit}
                    sx={{ width: "200px" }}
                  >
                    Submit
                  </Button>
                </Box>
              </div>
            </>
          )}
          {inputType === NewEntityTypes.GroupHat && (
            <>
              <Box sx={{ display: "flex", flexDirection: "row", gap: "16px" }}>
                <Box sx={{ width: "140px" }}>
                  <Select<FormFields>
                    name="hat.chain"
                    width="200px"
                    control={control}
                    label="Chain"
                    selectOptions={chainOptions}
                  />
                </Box>
                <Controller
                  name={"hat.tokenId"}
                  control={control}
                  render={({ field, fieldState: { error } }) => {
                    return (
                      <FormControl sx={{ width: "100%" }}>
                        <TextField
                          {...field}
                          label={"Hat Token Id"}
                          fullWidth
                          required
                          error={Boolean(error)}
                          placeholder="Address of this NFT contract"
                        />
                        <FormHelperText
                          sx={{
                            color: error?.message ? "error.main" : "black",
                          }}
                        >
                          {error?.message ?? ""}
                        </FormHelperText>
                      </FormControl>
                    );
                  }}
                />
              </Box>
              <HatsTokenCard chain={hatChain} tokenId={hatTokenId} />
              <Button
                onClick={handleSubmit(createAgents)}
                variant="contained"
                disabled={disableSubmit}
                sx={{ width: "200px" }}
              >
                Submit
              </Button>
            </>
          )}
        </form>
      </Box>
    </Modal>
  );
}
