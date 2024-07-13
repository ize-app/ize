import { MailOutline } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useStytch } from "@stytch/react";
import { useCallback, useContext, useState } from "react";

import { CurrentUserContext } from "@/contexts/current_user_context";
import { EntityType } from "@/graphql/generated/graphql";
import PageContainer from "@/layout/PageContainer";

import { LinkEmailModal } from "./LinkEmailModal";
import { ProfileForm } from "./ProfileForm";
import { attachDiscord } from "../../components/Auth/attachDiscord";
import { AvatarWithName } from "../../components/AvatarOld";
import { DiscordLogoSvg, EthLogoSvg } from "../../components/icons";

export const UserSettings = () => {
  const stytchClient = useStytch();
  const { me, refetch } = useContext(CurrentUserContext);

  const [emailModalOpen, setEmailModalOpen] = useState(false);

  let hasBlockchainIdentity = false;
  let hasDiscordIdentity = false;

  const identities = me
    ? me.identities.map((identity) => {
        switch (identity.identityType.__typename) {
          case "IdentityBlockchain": {
            hasBlockchainIdentity = true;
            return (
              <AvatarWithName
                color={"transparent"}
                id={identity.id}
                key={identity.id}
                name={identity.name}
                cryptoWallet={identity.identityType.address}
                avatarUrl={null}
                type={EntityType.Identity}
              />
            );
          }
          case "IdentityEmail": {
            return (
              <AvatarWithName
                color={"transparent"}
                id={identity.id}
                key={identity.id}
                name={identity.name}
                avatarUrl={identity.icon}
                type={EntityType.Identity}
              />
            );
          }
          case "IdentityDiscord": {
            hasDiscordIdentity = true;
            return (
              <AvatarWithName
                color={"transparent"}
                id={identity.id}
                key={identity.id}
                name={identity.name}
                avatarUrl={identity.icon}
                type={EntityType.Identity}
              />
            );
          }
        }
      })
    : [];

  const authenticateBlockchain = useCallback(async () => {
    /* Request user's address */
    const [crypto_wallet_address] = (await window.ethereum.request({
      method: "eth_requestAccounts",
    })) as string;

    /* Ask Stytch to generate a challenge for the user */
    const { challenge } = await stytchClient.cryptoWallets.authenticateStart({
      crypto_wallet_address,
      crypto_wallet_type: "ethereum",
    });

    /* Ask the user to sign the challenge, this takes place on your frontend and uses the browser's built-in crypto provider API. */
    const signature = await window.ethereum.request({
      method: "personal_sign",
      params: [challenge, crypto_wallet_address],
    });

    /* Send the signature back to Stytch for validation */
    await stytchClient.cryptoWallets.authenticate({
      crypto_wallet_address,
      crypto_wallet_type: "ethereum",
      signature: signature as string,
      session_duration_minutes: 1440,
    });

    await fetch("/api/auth/crypto", { method: "POST" });
    if (refetch) {
      await refetch();
    }
  }, [stytchClient]);

  return (
    <>
      <LinkEmailModal open={emailModalOpen} setOpen={setEmailModalOpen} />
      <PageContainer>
        <Typography variant="h1">Settings</Typography>
        <Typography variant="h2">Profile</Typography>
        <ProfileForm />
        <Typography variant="h2">Connected accounts</Typography>
        <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", margin: "16px 0px" }}>
          {identities}
          {!hasBlockchainIdentity && (
            <Button
              onClick={authenticateBlockchain}
              variant={"outlined"}
              sx={{ width: "200px" }}
              startIcon={<EthLogoSvg />}
            >
              Connect Eth Address
            </Button>
          )}
          <Button
            onClick={() => {
              setEmailModalOpen(true);
            }}
            variant={"outlined"}
            sx={{ width: "200px" }}
            startIcon={<MailOutline />}
          >
            Connect Email
          </Button>
          {!hasDiscordIdentity && (
            <Button
              onClick={attachDiscord}
              variant={"outlined"}
              sx={{ width: "200px" }}
              startIcon={<DiscordLogoSvg />}
            >
              Connect Discord
            </Button>
          )}
        </Box>
      </PageContainer>
    </>
  );
};
