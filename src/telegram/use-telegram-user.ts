"use client";

import { useContext } from "react";
import type { TelegramUser } from "./telegram-context";
import { TelegramUserContext } from "./telegram-context";

export function useTelegramUser(): TelegramUser | null {
  return useContext(TelegramUserContext);
}

