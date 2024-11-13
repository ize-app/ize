import { Request, Response } from "express";

import config from "@/config";
import { validOrigins } from "@/express/origins";

// for oauth/magiclink auth, stytch redirects to `http://${host}${path}?next_route={}`
// this handler redirects to whatever url is defined in next_route params
export const redirectAtLogin = ({ req, res }: { req: Request; res: Response }) => {
  const { next_route } = req.query;
  let redirectURL: URL;

  if (!next_route) {
    // If next_route is not provided, redirect to a default page
    return res.redirect(config.isDev ? config.LOCAL_URL : config.PROD_URL);
  }

  // eslint-disable-next-line
  const nextRoutePath = decodeURIComponent(next_route.toString());
  // check that origin is valid before redirecting
  const validHosts = validOrigins.map((origin) => new URL(origin).host);
  const requestHost = req.headers.host;

  if (config.isDev) {
    redirectURL = new URL(nextRoutePath, config.LOCAL_URL);
  } else if (requestHost && validHosts.includes(requestHost)) {
    const origin = req.headers.origin || `https://${requestHost}`;
    redirectURL = new URL(nextRoutePath, origin);
  } else {
    redirectURL = new URL(nextRoutePath, config.PROD_URL);
  }

  // removing potentially malicious url params
  redirectURL.search = "";

  res.redirect(redirectURL.toString());
};
