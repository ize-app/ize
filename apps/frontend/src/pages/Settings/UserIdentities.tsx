import { MailOutline } from "@mui/icons-material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useStytch } from "@stytch/react";
import { LoginButton as TelegramLoginButton } from "@telegram-auth/react";
import { useCallback, useContext, useState } from "react";

import defaultAvatarLogoUrl from "@/assets/default-avatar.svg";
import discordLogoUrl from "@/assets/discord-logo-blue.svg";
import emailLogoUrl from "@/assets/email.svg";
import etherumLogoUrl from "@/assets/ethereum.svg";
import telegramLogoUrl from "@/assets/telegram-logo.svg";
import { AvatarWithName } from "@/components/Avatar";
import { IdentitySummaryPartsFragment } from "@/graphql/generated/graphql";
import { CurrentUserContext } from "@/hooks/contexts/current_user_context";

import { LinkEmailModal } from "./LinkEmailModal";
import { attachDiscord } from "../../components/Auth/attachDiscord";
import { DiscordLogoSvg, EthLogoSvg } from "../../components/icons";

const getIdentityTypeLogo = (identity: IdentitySummaryPartsFragment) => {
  switch (identity.identityType.__typename) {
    case "IdentityTelegram":
      return telegramLogoUrl;
    case "IdentityDiscord":
      return discordLogoUrl;
    case "IdentityBlockchain":
      return etherumLogoUrl;
    case "IdentityEmail":
      return emailLogoUrl;
    default:
      return defaultAvatarLogoUrl;
  }
};

export const UserIdentities = ({
  identities,
}: {
  identities: IdentitySummaryPartsFragment[] | null | undefined;
}) => {
  const stytchClient = useStytch();
  const { me, refetch } = useContext(CurrentUserContext);

  const [emailModalOpen, setEmailModalOpen] = useState(false);

  const hasBlockchainIdentity = !!me?.identities.some(
    (id) => id.identityType.__typename === "IdentityBlockchain",
  );
  const hasDiscordIdentity = !!me?.identities.some(
    (id) => id.identityType.__typename === "IdentityDiscord",
  );

  const hasTelegramIdentity = !!me?.identities.find(
    (id) => id.identityType?.__typename === "IdentityTelegram",
  );

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
      {identities && (
        <table>
          <tbody>
            {identities.map((identity) => (
              <tr key={identity.id}>
                <td
                  style={{
                    width: "20px",
                    paddingRight: "24px",
                  }}
                >
                  <img
                    src={getIdentityTypeLogo(identity)}
                    style={{ width: "20px", height: "20px", verticalAlign: "middle" }}
                  />
                </td>
                <td>
                  <AvatarWithName avatar={identity} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px", margin: "16px 0px" }}>
        {!hasBlockchainIdentity && (
          <Button
            onClick={authenticateBlockchain}
            variant={"outlined"}
            sx={{ width: "200px" }}
            size="small"
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
          size="small"
        >
          Connect Email
        </Button>
        {!hasDiscordIdentity && (
          <Button
            onClick={attachDiscord}
            variant={"outlined"}
            sx={{ width: "200px" }}
            size="small"
            startIcon={<DiscordLogoSvg />}
          >
            Connect Discord
          </Button>
        )}
        {!hasTelegramIdentity && (
          <TelegramLoginButton
            botUsername={"ize_app_bot"}
            onAuthCallback={async (data) => {
              await fetch("/api/auth/telegram", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(data), // Send the URL parameters to the backend
              });
            }}
            buttonSize="medium"
            cornerRadius={5} // 0 - 20
            showAvatar={false} // true | false
            lang="en"
          />
        )}
      </Box>
    </>
  );
};
