import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useStytch } from "@stytch/react";
import { useCallback } from "react";

export const UserSettings = () => {
  const stytchClient = useStytch();

  const trigger = useCallback(async () => {
    /* Request user's address */
    const [crypto_wallet_address] = await ethereum.request({
      method: "eth_requestAccounts",
    });

    /* Ask Stytch to generate a challenge for the user */
    const { challenge } = await stytchClient.cryptoWallets.authenticateStart({
      crypto_wallet_address,
      crypto_wallet_type: "ethereum",
    });

    /* Ask the user to sign the challenge, this takes place on your frontend and uses the browser's built-in crypto provider API. */
    const signature = await ethereum.request({
      method: "personal_sign",
      params: [challenge, crypto_wallet_address],
    });

    /* Send the signature back to Stytch for validation */
    await stytchClient.cryptoWallets.authenticate({
      crypto_wallet_address,
      crypto_wallet_type: "ethereum",
      signature,
      session_duration_minutes: 60,
    });
  }, [stytchClient]);
  return (
    <Box>
      <Box typography={"h1"}>Settings</Box>
      <Box typography={"h2"}>Connected accounts </Box>
      <Button onClick={trigger} variant={"outlined"}>
        Connect Eth Address
      </Button>
    </Box>
  );
};
