import { Request, Response } from "express";

// for oauth/magiclink auth, stytch redirects to "http://localhost:5173?next_route={}"
// this handler redirects to whatever url is defined in next_route params
export const redirectAtLogin = ({ req, res }: { req: Request; res: Response }) => {
  const { next_route } = req.query;

  const redirectURL = new URL(next_route?.toString() as string, "http://localhost:5173");
  // removing potentially malicious url params
  redirectURL.search = "";

  res.redirect(redirectURL.toString());
};
