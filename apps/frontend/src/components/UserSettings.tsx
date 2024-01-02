import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useStytch } from "@stytch/react";
import { useCallback, useContext } from "react";
import PageContainer from "@/layout/PageContainer";
import { AvatarWithName } from "./shared/Avatar";
import { AgentType } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/contexts/current_user_context";
import Box from "@mui/material/Box";

export const UserSettings = () => {
  const stytchClient = useStytch();
  const { me } = useContext(CurrentUserContext);

  let hasBlockchainIdentity = false;
  let hasEmailIdentity = false;
  let hasDiscordIdentity = false;

  const identities = me
    ? me.identities.map((identity) => {
        switch (identity.identityType.__typename) {
          case "IdentityBlockchain": {
            hasBlockchainIdentity = true;
            return (
              <AvatarWithName
                id={identity.id}
                key={identity.id}
                name={identity.name}
                avatarUrl={"./ethereum.svg"}
                type={AgentType.Identity}
              />
            );
          }
          case "IdentityEmail": {
            hasEmailIdentity = true;
            return (
              <AvatarWithName
                id={identity.id}
                key={identity.id}
                name={identity.name}
                avatarUrl={"./email.svg"}
                type={AgentType.Identity}
              />
            );
          }
          case "IdentityDiscord": {
            hasDiscordIdentity = true;
            return (
              <AvatarWithName
                id={identity.id}
                key={identity.id}
                name={identity.name}
                avatarUrl={"./discord-logo-black.svg"}
                type={AgentType.Identity}
              />
            );
          }
        }
      })
    : [];

  const trigger = useCallback(async () => {
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
      session_duration_minutes: 60,
    });
  }, [stytchClient]);
  return (
    <PageContainer>
      <Typography variant="h1">Settings</Typography>
      <Typography variant="h2">Connected accounts</Typography>
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", margin: "16px 0px" }}>
        {identities}
        {!hasBlockchainIdentity && (
          <Button onClick={trigger} variant={"outlined"} sx={{ width: "200px" }}>
            Connect Eth Address
          </Button>
        )}
      </Box>
    </PageContainer>
  );
};
