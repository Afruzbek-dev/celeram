import { createHmac, timingSafeEqual } from "node:crypto";

export type AuthenticatedTelegramUser = { id: string; firstName: string; lastName?: string; username?: string };

export function validateTelegramInitData(initData: string, botToken: string, maxAgeSeconds = 86400): AuthenticatedTelegramUser {
  const params = new URLSearchParams(initData);
  const receivedHash = params.get("hash");
  const authDate = Number(params.get("auth_date"));
  if (!receivedHash || !Number.isFinite(authDate) || Math.floor(Date.now() / 1000) - authDate > maxAgeSeconds) throw new Error("Invalid or expired Telegram init data");
  const dataCheckString = [...params.entries()].filter(([key]) => key !== "hash").sort(([a], [b]) => a.localeCompare(b)).map(([key, value]) => `${key}=${value}`).join("\n");
  const secret = createHmac("sha256", "WebAppData").update(botToken).digest();
  const expected = createHmac("sha256", secret).update(dataCheckString).digest("hex");
  if (receivedHash.length !== expected.length || !timingSafeEqual(Buffer.from(receivedHash), Buffer.from(expected))) throw new Error("Invalid Telegram signature");
  const rawUser = params.get("user"); if (!rawUser) throw new Error("Telegram user is missing");
  const user = JSON.parse(rawUser) as { id: number|string; first_name?: string; last_name?: string; username?: string };
  return { id: String(user.id), firstName: user.first_name ?? "", lastName: user.last_name, username: user.username };
}

