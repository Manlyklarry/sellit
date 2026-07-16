import { fromNodeHeaders } from "better-auth/node";

import { auth } from "../auth.js";

export async function resolveAuthenticatedUser(req) {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  });

  return session?.user || null;
}

export function attachAuthenticatedUser(resolveUser = resolveAuthenticatedUser) {
  return async function authenticationMiddleware(req, _res, next) {
    try {
      req.authUser =
        resolveUser === resolveAuthenticatedUser && !req.headers.cookie
          ? null
          : await resolveUser(req);
      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAuthenticatedUser(req, res) {
  if (req.authUser?.id) return req.authUser;

  res.status(401).json({ error: "Sign in to continue." });
  return null;
}

export function requireAuthentication(req, res, next) {
  if (req.authUser?.id) {
    next();
    return;
  }

  res.status(401).json({ error: "Sign in to continue." });
}
