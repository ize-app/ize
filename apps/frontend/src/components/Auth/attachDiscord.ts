/*
  Annoyingly, stytch client SDK doesn't allow you to add the 
  attach token to their normal stytchClient.oauth.discord.start method, 
  so I need to manually construct the request URL
  */
export const attachDiscord = async () => {
  const resp = await fetch("/api/auth/attach-discord", {
    method: "POST",
  });
  let baseUrlString: string;

  if (import.meta.env.MODE === "development")
    baseUrlString = "https://test.stytch.com/v1/public/oauth/discord/start";
  else baseUrlString = "https://api.stytch.com/v1/public/oauth/discord/start";

  if (!resp.ok) throw Error("Discord attach request failed");

  const attachToken = await resp.text();

  const scopes = ["identify", "guilds"];
  const loginRedirectUrl = `${window.location.origin}/api/auth/token?next_route=${window.location.pathname}`;
  const signupRedirectUrl = `${window.location.origin}/api/auth/token?next_route=${window.location.pathname}`;
  const baseUrl = new URL(baseUrlString); 

  baseUrl.searchParams.append("public_token", import.meta.env.VITE_STYTCH_PUBLIC_TOKEN as string);
  baseUrl.searchParams.append("login_redirect_url", loginRedirectUrl);
  baseUrl.searchParams.append("signup_redirect_url", signupRedirectUrl);
  baseUrl.searchParams.append("custom_scopes", scopes.join(" "));
  baseUrl.searchParams.append("oauth_attach_token", attachToken);

  window.open(baseUrl);
};
