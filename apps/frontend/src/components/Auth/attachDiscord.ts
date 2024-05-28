/*
  Annoyingly, stytch client SDK doesn't allow you to add the 
  attach token to their normal stytchClient.oauth.discord.start method, 
  so I need to manually construct the request URL
  */
export const attachDiscord = async () => {
  const resp = await fetch("/api/auth/attach-discord", {
    method: "POST",
  });

  if (!resp.ok) throw Error("Discord attach request failed");

  const attachToken = await resp.text();

  const scopes = ["identify", "guilds"];
  const loginRedirectUrl = "http://localhost:5173/api/auth/token?next_route=/"; //+ window.location.pathname;
  const signupRedirectUrl = "http://localhost:5173/api/auth/token?next_route=/"; //+ window.location.pathname;
  const baseUrl = new URL("https://test.stytch.com/v1/public/oauth/discord/start");

  baseUrl.searchParams.append("public_token", import.meta.env.VITE_STYTCH_PUBLIC_TOKEN as string);
  baseUrl.searchParams.append("login_redirect_url", loginRedirectUrl);
  baseUrl.searchParams.append("signup_redirect_url", signupRedirectUrl);
  baseUrl.searchParams.append("custom_scopes", scopes.join(" "));
  baseUrl.searchParams.append("oauth_attach_token", attachToken);

  window.open(baseUrl);
};
