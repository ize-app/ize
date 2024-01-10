import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { useStytch } from "@stytch/react";
import { useCallback, useContext, useState } from "react";
import PageContainer from "@/layout/PageContainer";
import { AvatarWithName } from "../shared/Avatar";
import { AgentType } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/contexts/current_user_context";
import Box from "@mui/material/Box";
import { DiscordLogoSvg, EthLogoSvg } from "../shared/icons";
import { MailOutline } from "@mui/icons-material";
import { LinkEmailModal } from "./LinkEmailModal";

export const UserSettings = () => {
  const stytchClient = useStytch();
  const { me } = useContext(CurrentUserContext);

  const [emailModalOpen, setEmailModalOpen] = useState(false);

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
                color={"transparent"}
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
                color={"transparent"}
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
                color={"transparent"}
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
      session_duration_minutes: 60,
    });
  }, [stytchClient]);

  /*
  Annoyingly, stytch client SDK doesn't allow you to add the 
  attach token to their normal stytchClient.oauth.discord.start method, 
  so I need to manually construct the request URL
  */
  const authenticateDiscord = useCallback(async () => {
    const resp = await fetch("api/auth/attach-discord");
    const attachToken = await resp.text();

    const scopes = ["identify", "guilds"];
    const loginRedirectUrl = "http://localhost:5173/settings";
    const signupRedirectUrl = "http://localhost:5173/settings";
    const baseUrl = new URL("https://test.stytch.com/v1/public/oauth/discord/start");
    //@ts-ignore
    baseUrl.searchParams.append("public_token", import.meta.env.VITE_STYTCH_PUBLIC_TOKEN as string);
    baseUrl.searchParams.append("login_redirect_url", loginRedirectUrl);
    baseUrl.searchParams.append("signup_redirect_url", signupRedirectUrl);
    baseUrl.searchParams.append("custom_scopes", scopes.join(" "));
    baseUrl.searchParams.append("oauth_attach_token", attachToken);
    window.open(baseUrl);
  }, [stytchClient]);

  return (
    <>
      <LinkEmailModal open={emailModalOpen} setOpen={setEmailModalOpen} />
      <PageContainer>
        <Typography variant="h1">Settings</Typography>
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
          <Button
            onClick={authenticateDiscord}
            variant={"outlined"}
            sx={{ width: "200px" }}
            startIcon={<DiscordLogoSvg />}
          >
            Connect Discord
          </Button>
        </Box>
      </PageContainer>
    </>
  );
};
