import { Request, Response } from "express";

// for oauth/magiclink auth, stytch redirects to `http://${host}${path}?next_route={}`
// this handler redirects to whatever url is defined in next_route params
import { prodUrl, validOrigins } from "@/express/server";

export const redirectAtLogin = ({ req, res }: { req: Request; res: Response }) => {
  const { next_route } = req.query;
  let redirectURL: URL;

  // check that origin is valid before redirecting
  const validHosts = validOrigins.map((origin) => new URL(origin).host);
  const validOrigin = req.headers.host ? validHosts.includes(req.headers.host) : false
  if (validOrigin) redirectURL = new URL(next_route?.toString() as string, req.headers.origin);
  else redirectURL = new URL(next_route?.toString() as string, prodUrl);

  // removing potentially malicious url params
  redirectURL.search = "";

  res.redirect(redirectURL.toString());
};
