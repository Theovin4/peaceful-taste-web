import crypto from "node:crypto";
import * as cookie from "cookie";
import type { Request, Response } from "express";
import { ENV } from "./env";

export const ADMIN_COOKIE_NAME = "peaceful_taste_admin";
const ADMIN_SESSION_DURATION_MS = 1000 * 60 * 60 * 8;

type AdminSessionPayload = {
  exp: number;
};

function getAdminPassword() {
  return process.env.ADMIN_PASSWORD ?? "peaceful123";
}

function getSigningSecret() {
  return ENV.cookieSecret || getAdminPassword();
}

function signValue(value: string) {
  return crypto.createHmac("sha256", getSigningSecret()).update(value).digest("hex");
}

export function isValidAdminPassword(password: string) {
  return password === getAdminPassword();
}

export function createAdminSessionToken() {
  const payload: AdminSessionPayload = {
    exp: Date.now() + ADMIN_SESSION_DURATION_MS,
  };
  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = signValue(encoded);
  return `${encoded}.${signature}`;
}

export function verifyAdminSessionToken(token?: string | null) {
  if (!token) return false;
  const [encoded, signature] = token.split(".");
  if (!encoded || !signature) return false;

  const expectedSignature = signValue(encoded);
  if (signature.length !== expectedSignature.length) {
    return false;
  }
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return false;
  }

  try {
    const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as AdminSessionPayload;
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function readAdminSessionFromRequest(req: Request) {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return false;
  const cookies = cookie.parse(cookieHeader);
  return verifyAdminSessionToken(cookies[ADMIN_COOKIE_NAME]);
}

function buildCookieString(token: string, maxAge: number) {
  const parts = [
    `${ADMIN_COOKIE_NAME}=${encodeURIComponent(token)}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ];

  if (ENV.isProduction) {
    parts.push("Secure");
  }

  return parts.join("; ");
}

export function setAdminSessionCookie(res: Response, token: string) {
  res.append(
    "Set-Cookie",
    buildCookieString(token, Math.floor(ADMIN_SESSION_DURATION_MS / 1000))
  );
}

export function clearAdminSessionCookie(res: Response) {
  res.append(
    "Set-Cookie",
    buildCookieString("", 0)
  );
}
